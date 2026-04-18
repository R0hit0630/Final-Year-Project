import crypto from "crypto";
import Booking from "../models/Booking.js";
import Package from "../models/Package.js";
import User from "../models/user.js";

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

  const directDate = new Date(selectedDate);
  if (!Number.isNaN(directDate.getTime())) {
    return directDate;
  }

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
    const { packageId, selectedDate, groupSize, subtotal, serviceFee, total } =
      req.body;

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

    const transaction_uuid = `PKG-${packageId}-${req.user._id}-${Date.now()}`;
    const total_amount = Number(total).toFixed(2);
    const product_code = ESEWA_PRODUCT_CODE;

    const signature = generateSignature({
      total_amount,
      transaction_uuid,
      product_code,
    });

    const successParams = new URLSearchParams({
      packageId,
      selectedDate,
      groupSize: String(groupSize),
      subtotal: String(Number(subtotal || 0)),
      serviceFee: String(Number(serviceFee || 0)),
      total: String(Number(total || 0)),
      tx: transaction_uuid,
      userId: String(req.user._id), // OPTION A
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
          success_url: `${BASE_URL}/payment/esewa/success?${successParams.toString()}`,
          failure_url: `${BASE_URL}/payment/esewa/failure`,
          signed_field_names: "total_amount,transaction_uuid,product_code",
          signature,
        },
      },
    });
  } catch (error) {
    console.error("initiateEsewaPayment error:", error);
    return res
      .status(500)
      .json({ message: "Server error while initiating payment" });
  }
};

export const verifyEsewaPayment = async (req, res) => {
  try {
    const {
      data,
      packageId,
      selectedDate,
      groupSize,
      subtotal,
      serviceFee,
      total,
      tx,
      userId,
    } = req.body;

    if (!data) {
      return res.status(400).json({ message: "Missing eSewa response data" });
    }

    if (!packageId || !selectedDate || !groupSize || !total || !userId) {
      return res.status(400).json({ message: "Missing booking payload" });
    }

    const user = await User.findById(userId).select("_id isActive");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (user.isActive === false) {
      return res.status(403).json({ message: "Account disabled" });
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

    if (tx && tx !== transaction_uuid) {
      return res.status(400).json({ message: "Transaction mismatch" });
    }

    if (status !== "COMPLETE") {
      return res.status(400).json({ message: "Payment not completed" });
    }

    const statusCheckUrl = `https://rc.esewa.com.np/api/epay/transaction/status/?product_code=${product_code}&total_amount=${total_amount}&transaction_uuid=${transaction_uuid}`;

    const statusRes = await fetch(statusCheckUrl);
    const statusData = await statusRes.json();

    if (statusData.status !== "COMPLETE") {
      return res.status(400).json({
        message: "Payment verification with eSewa failed",
      });
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

    const existingBooking = await Booking.findOne({
      transactionUuid: transaction_uuid,
      user: userId,
    });

    if (existingBooking) {
      return res.status(200).json({
        message: "Payment already verified and booking already created",
        booking: existingBooking,
        payment: {
          transaction_uuid,
          transaction_code,
          total_amount,
          status: statusData.status,
          ref_id: statusData.ref_id,
        },
      });
    }

    const booking = await Booking.create({
      user: userId,
      package: packageId,
      travelers: Number(groupSize),
      startDate: parsedStartDate,
      endDate: parsedEndDate,
      totalPrice: Number(total),
      notes: `Subtotal: ${subtotal || 0}, Service Fee: ${serviceFee || 0}`,
      status: "confirmed",
      paymentStatus: "paid",
      transactionUuid: transaction_uuid,
      paymentReference: transaction_code || statusData.ref_id || "",
      guide: null,
      guideAssigned: false,
    });

    return res.status(200).json({
      message: "Payment verified successfully and booking confirmed",
      booking,
      payment: {
        transaction_uuid,
        transaction_code,
        total_amount,
        status: statusData.status,
        ref_id: statusData.ref_id,
      },
    });
  } catch (error) {
    console.error("verifyEsewaPayment error:", error);
    return res
      .status(500)
      .json({ message: "Server error while verifying payment" });
  }
};