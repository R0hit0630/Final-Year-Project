import crypto from "crypto";
import Booking from "../models/Booking.js";
import Package from "../models/Package.js";

const ESEWA_PRODUCT_CODE = process.env.ESEWA_PRODUCT_CODE || "EPAYTEST";
const ESEWA_SECRET = process.env.ESEWA_SECRET || "8gBm/:&EnhH.1/q";
const ESEWA_PAYMENT_URL =
  process.env.ESEWA_PAYMENT_URL ||
  "https://rc-epay.esewa.com.np/api/epay/main/v2/form";

const BASE_URL = process.env.BASE_URL || "http://localhost:5173";

const generateSignature = ({ total_amount, transaction_uuid, product_code }) => {
  const message = `total_amount=${total_amount},transaction_uuid=${transaction_uuid},product_code=${product_code}`;

  return crypto
    .createHmac("sha256", ESEWA_SECRET)
    .update(message)
    .digest("base64");
};

const parseSelectedDate = (selectedDate) => {
  if (!selectedDate) return null;

  // Case 1: already a valid date string
  const directDate = new Date(selectedDate);
  if (!Number.isNaN(directDate.getTime())) {
    return directDate;
  }

  // Case 2: format like "Apr 20, 2026 - Apr 25, 2026"
  if (selectedDate.includes(" - ")) {
    const firstPart = selectedDate.split(" - ")[0]?.trim();
    const parsed = new Date(firstPart);
    if (!Number.isNaN(parsed.getTime())) {
      return parsed;
    }
  }

  return null;
};

const calculateEndDate = (startDate, days) => {
  if (!startDate) return null;

  const end = new Date(startDate);
  const tripDays = Number(days || 1);

  if (tripDays > 1) {
    end.setDate(end.getDate() + tripDays - 1);
  }

  return end;
};

export const initiateEsewaPayment = async (req, res) => {
  try {
    const { packageId, selectedDate, groupSize, subtotal, serviceFee, total } = req.body;

    if (!packageId || !selectedDate || !groupSize || !total) {
      return res.status(400).json({ message: "Missing required payment data" });
    }

    if (!req.user?._id) {
      return res.status(401).json({ message: "Unauthorized user" });
    }

    const pkg = await Package.findById(packageId);
    if (!pkg) {
      return res.status(404).json({ message: "Package not found" });
    }

    const parsedStartDate = parseSelectedDate(selectedDate);
    if (!parsedStartDate) {
      return res.status(400).json({ message: "Invalid selected date format" });
    }

    const parsedEndDate = calculateEndDate(parsedStartDate, pkg.days);

    const transaction_uuid = `PKG-${packageId}-${Date.now()}`;
    const total_amount = Number(total).toFixed(2);
    const product_code = ESEWA_PRODUCT_CODE;

    const signature = generateSignature({
      total_amount,
      transaction_uuid,
      product_code,
    });

    // Prevent duplicate pending bookings for same package/date/user if needed
    const existingPendingBooking = await Booking.findOne({
      user: req.user._id,
      package: packageId,
      startDate: parsedStartDate,
      status: "pending",
      paymentStatus: "pending",
    });

    if (existingPendingBooking) {
      await Booking.deleteOne({ _id: existingPendingBooking._id });
    }

    // Create booking as pending BEFORE redirecting to eSewa
    await Booking.create({
      user: req.user._id,
      package: packageId,
      travelers: Number(groupSize),
      startDate: parsedStartDate,
      endDate: parsedEndDate,
      totalPrice: Number(total),
      notes: `Subtotal: ${subtotal || 0}, Service Fee: ${serviceFee || 0}`,
      status: "pending",
      paymentStatus: "pending",
      transactionUuid: transaction_uuid,
      guide: null,
      guideAssigned: false,
    });

    return res.status(200).json({
      payment: {
        payment_url: ESEWA_PAYMENT_URL,
        fields: {
          amount: Number(subtotal || 0).toFixed(2),
          tax_amount: "0",
          total_amount,
          transaction_uuid,
          product_code,
          product_service_charge: Number(serviceFee || 0).toFixed(2),
          product_delivery_charge: "0",
          success_url: `${BASE_URL}/payment/esewa/success`,
          failure_url: `${BASE_URL}/payment/esewa/failure`,
          signed_field_names: "total_amount,transaction_uuid,product_code",
          signature,
        },
        meta: {
          packageId,
          selectedDate,
          groupSize,
        },
      },
    });
  } catch (error) {
    console.error("initiateEsewaPayment error:", error);
    return res.status(500).json({ message: "Server error while initiating payment" });
  }
};

export const verifyEsewaPayment = async (req, res) => {
  try {
    const { data } = req.body;

    if (!data) {
      return res.status(400).json({ message: "Missing eSewa response data" });
    }

    const decoded = JSON.parse(Buffer.from(data, "base64").toString("utf-8"));

    const {
      transaction_uuid,
      total_amount,
      status,
      product_code,
      transaction_code,
    } = decoded;

    if (!transaction_uuid) {
      return res.status(400).json({ message: "Missing transaction UUID" });
    }

    const booking = await Booking.findOne({ transactionUuid: transaction_uuid });

    if (!booking) {
      return res.status(404).json({ message: "Booking not found for this payment" });
    }

    if (booking.paymentStatus === "paid" && booking.status === "confirmed") {
      return res.status(200).json({
        message: "Payment already verified and booking already confirmed",
        booking,
      });
    }

    if (status !== "COMPLETE") {
      booking.status = "cancelled";
      booking.paymentStatus = "pending";
      await booking.save();

      return res.status(400).json({ message: "Payment not completed" });
    }

    const statusCheckUrl = `https://rc.esewa.com.np/api/epay/transaction/status/?product_code=${product_code}&total_amount=${total_amount}&transaction_uuid=${transaction_uuid}`;

    const statusRes = await fetch(statusCheckUrl);
    const statusData = await statusRes.json();

    if (statusData.status !== "COMPLETE") {
      booking.status = "cancelled";
      booking.paymentStatus = "pending";
      await booking.save();

      return res.status(400).json({
        message: "Payment verification with eSewa failed",
      });
    }

    booking.status = "confirmed";
    booking.paymentStatus = "paid";
    booking.guide = booking.guide || null;
    booking.guideAssigned = booking.guideAssigned || false;
    booking.paymentReference = transaction_code || statusData.ref_id || "";
    await booking.save();

    return res.status(200).json({
      message: "Payment verified successfully and booking confirmed",
      payment: {
        transaction_uuid,
        transaction_code,
        total_amount,
        status: statusData.status,
        ref_id: statusData.ref_id,
      },
      booking,
    });
  } catch (error) {
    console.error("verifyEsewaPayment error:", error);
    return res.status(500).json({ message: "Server error while verifying payment" });
  }
};