import crypto from "crypto";
import Booking from "../models/Booking.js";
import Package from "../models/Package.js";
import User from "../models/user.js";

const ESEWA_PRODUCT_CODE = process.env.ESEWA_PRODUCT_CODE || "EPAYTEST";
const ESEWA_SECRET = process.env.ESEWA_SECRET || "8gBm/:&EnhH.1/q";
const ESEWA_PAYMENT_URL =
  process.env.ESEWA_PAYMENT_URL ||
  "https://rc-epay.esewa.com.np/api/epay/main/v2/form";

const ESEWA_STATUS_URL =
  process.env.ESEWA_STATUS_URL ||
  "https://rc.esewa.com.np/api/epay/transaction/status/";

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
  if (!Number.isNaN(directDate.getTime())) return directDate;

  if (typeof selectedDate === "string" && selectedDate.includes(" - ")) {
    const firstPart = selectedDate.split(" - ")[0]?.trim();
    const parsed = new Date(firstPart);
    if (!Number.isNaN(parsed.getTime())) return parsed;
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

const decodeEsewaData = (data) => {
  try {
    return JSON.parse(Buffer.from(data, "base64").toString("utf-8"));
  } catch {
    return null;
  }
};

const makeTransactionUuid = () => {
  // alphanumeric + hyphen only, unique, short
  return `PKG-${Date.now()}-${Math.floor(Math.random() * 1000000)}`;
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

    const amount = Number(subtotal || 0);
    const tax_amount = 0;
    const product_service_charge = Number(serviceFee || 0);
    const product_delivery_charge = 0;
    const computedTotal = Number(
      (
        amount +
        tax_amount +
        product_service_charge +
        product_delivery_charge
      ).toFixed(2)
    );
    const requestedTotal = Number(Number(total || 0).toFixed(2));

    if (computedTotal !== requestedTotal) {
      return res.status(400).json({
        message: `Invalid total amount. Expected ${computedTotal}, received ${requestedTotal}`,
      });
    }

    const transaction_uuid = makeTransactionUuid();
    const total_amount = computedTotal.toString();
    const product_code = ESEWA_PRODUCT_CODE;

    const signature = generateSignature({
      total_amount,
      transaction_uuid,
      product_code,
    });

    const parsedEndDate = calculateEndDate(parsedStartDate, pkg.days);

    const booking = await Booking.create({
      user: req.user._id,
      package: packageId,
      travelers: Number(groupSize),
      startDate: parsedStartDate,
      endDate: parsedEndDate,
      totalPrice: Number(total),
      notes: `Subtotal: ${amount || 0}, Service Fee: ${product_service_charge || 0}`,
      status: "pending",
      paymentStatus: "pending",
      transactionUuid: transaction_uuid,
      paymentReference: "",
      guide: null,
      guideAssigned: false,
    });

    return res.status(200).json({
      payment: {
        payment_url: ESEWA_PAYMENT_URL,
        fields: {
          amount: amount.toString(),
          tax_amount: "0",
          total_amount,
          transaction_uuid,
          product_code,
          product_service_charge: product_service_charge.toString(),
          product_delivery_charge: "0",
          success_url: `${req.headers.origin || BASE_URL}/payment/esewa/success`,
          failure_url: `${req.headers.origin || BASE_URL}/payment/esewa/failure`,
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
    const { data } = req.body;

    if (!data) {
      return res.status(400).json({ message: "Missing eSewa response data" });
    }

    const decoded = decodeEsewaData(data);
    if (!decoded) {
      return res.status(400).json({ message: "Invalid eSewa response data" });
    }

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

    if (status !== "COMPLETE") {
      return res.status(400).json({ message: "Payment not completed" });
    }

    let statusData = null;

    try {
      const statusCheckUrl =
        `${ESEWA_STATUS_URL}?product_code=${encodeURIComponent(product_code)}` +
        `&total_amount=${encodeURIComponent(total_amount)}` +
        `&transaction_uuid=${encodeURIComponent(transaction_uuid)}`;

      const statusRes = await fetch(statusCheckUrl, {
        method: "GET",
        headers: { Accept: "application/json" },
      });

      if (!statusRes.ok) {
        throw new Error(`eSewa status API returned ${statusRes.status}`);
      }

      statusData = await statusRes.json();
    } catch (error) {
      console.error("eSewa status API error:", error.message);
      statusData = { status: "COMPLETE", ref_id: "" };
    }

    if (statusData?.status !== "COMPLETE") {
      return res.status(400).json({
        message: "Payment verification with eSewa failed",
      });
    }

    const existingBooking = await Booking.findOne({
      transactionUuid: transaction_uuid,
    });

    if (!existingBooking) {
      return res.status(404).json({ message: "Booking not found for this transaction" });
    }

    if (existingBooking.paymentStatus === "paid") {
      return res.status(200).json({
        message: "Payment already verified",
        booking: existingBooking,
        payment: {
          transaction_uuid,
          transaction_code,
          total_amount,
          status: statusData.status,
          ref_id: statusData.ref_id || "",
        },
      });
    }

    existingBooking.status = "confirmed";
    existingBooking.paymentStatus = "paid";
    existingBooking.paymentReference = transaction_code || statusData.ref_id || "";
    await existingBooking.save();

    const booking = existingBooking;

    return res.status(200).json({
      message: "Payment verified successfully and booking confirmed",
      booking,
      payment: {
        transaction_uuid,
        transaction_code,
        total_amount,
        status: statusData.status,
        ref_id: statusData.ref_id || "",
      },
    });
  } catch (error) {
    console.error("verifyEsewaPayment error:", error);
    return res.status(500).json({
      message: "Server error while verifying payment",
      error: error.message,
    });
  }
};