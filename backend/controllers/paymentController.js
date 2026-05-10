import crypto from "crypto";
import Booking from "../models/Booking.js";
import Payment from "../models/Payment.js";
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

    // eSewa RC (sandbox) requires whole-number amounts — no decimals
    const amount = Math.round(Number(subtotal || 0));
    const tax_amount = 0;
    const product_service_charge = Math.round(Number(serviceFee || 0));
    const product_delivery_charge = 0;
    const computedTotal = amount + tax_amount + product_service_charge + product_delivery_charge;
    const requestedTotal = Math.round(Number(total || 0));

    if (computedTotal !== requestedTotal) {
      return res.status(400).json({
        message: `Invalid total amount. Expected ${computedTotal}, received ${requestedTotal}`,
      });
    }

    const transaction_uuid = makeTransactionUuid();
    const total_amount = computedTotal.toString();
    const product_code = ESEWA_PRODUCT_CODE.trim();

    // The signature message must be exactly: total_amount=100,transaction_uuid=11-22-33,product_code=EPAYTEST
    const message = `total_amount=${total_amount},transaction_uuid=${transaction_uuid},product_code=${product_code}`;
    
    const signature = crypto
      .createHmac("sha256", ESEWA_SECRET.trim())
      .update(message)
      .digest("base64");

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

    console.log("Successfully created pending booking:", booking._id);

    // Also create a separate Payment record
    const paymentRecord = await Payment.create({
      user: req.user._id,
      booking: booking._id,
      amount: computedTotal,
      transactionUuid: transaction_uuid,
      paymentMethod: "esewa",
      status: "pending",
    });
    console.log("Successfully created pending payment record:", paymentRecord._id);

    return res.status(200).json({
      message: "Payment initiated",
      booking,
      payment: {
        payment_url: ESEWA_PAYMENT_URL.trim(),
        fields: {
          amount: amount.toString(),
          tax_amount: tax_amount.toString(),
          total_amount: total_amount,
          transaction_uuid: transaction_uuid,
          product_code: product_code,
          product_service_charge: product_service_charge.toString(),
          product_delivery_charge: product_delivery_charge.toString(),
          success_url: `${req.headers.origin?.replace(/\/$/, "") || BASE_URL.replace(/\/$/, "")}/payment/esewa/success`,
          failure_url: `${req.headers.origin?.replace(/\/$/, "") || BASE_URL.replace(/\/$/, "")}/payment/esewa/failure`,
          signed_field_names: "total_amount,transaction_uuid,product_code",
          signature: signature,
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
    console.log("Received eSewa verify request with data:", data);

    if (!data) {
      return res.status(400).json({ message: "Missing eSewa response data" });
    }

    const decoded = decodeEsewaData(data);
    console.log("Decoded eSewa data:", decoded);

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
      console.warn("eSewa status is not COMPLETE:", status);
      return res.status(400).json({ message: `Payment status is ${status}` });
    }

    let statusData = null;

    try {
      // Remove trailing slash if present in ESEWA_STATUS_URL
      const baseUrl = ESEWA_STATUS_URL.trim().replace(/\/$/, "");
      const statusCheckUrl =
        `${baseUrl}?product_code=${encodeURIComponent(product_code)}` +
        `&total_amount=${encodeURIComponent(total_amount)}` +
        `&transaction_uuid=${encodeURIComponent(transaction_uuid)}`;

      console.log("Checking eSewa status at:", statusCheckUrl);

      const statusRes = await fetch(statusCheckUrl, {
        method: "GET",
        headers: { Accept: "application/json" },
      });

      if (!statusRes.ok) {
        throw new Error(`eSewa status API returned ${statusRes.status}`);
      }

      statusData = await statusRes.json();
      console.log("eSewa status API response:", statusData);
    } catch (error) {
      console.error("eSewa status API error:", error.message);
      // In production, never silently accept a payment if the status API is down
      if (process.env.NODE_ENV === "production") {
        return res.status(503).json({
          message: "Could not verify payment with eSewa. Please contact support.",
        });
      }
      // Fallback only in development/sandbox — trust the decoded data
      statusData = { status: "COMPLETE", ref_id: transaction_code || "SANDBOX_REF" };
    }

    if (statusData?.status !== "COMPLETE") {
      console.error("Status verification failed:", statusData);
      return res.status(400).json({
        message: "Payment verification with eSewa failed",
      });
    }

    console.log("Finding booking with transactionUuid:", transaction_uuid);
    const existingBooking = await Booking.findOne({
      transactionUuid: transaction_uuid,
    });

    if (!existingBooking) {
      console.error("No booking found for transactionUuid:", transaction_uuid);
      return res.status(404).json({ message: "Booking not found for this transaction" });
    }

    if (existingBooking.paymentStatus === "paid") {
      console.log("Booking already marked as paid:", existingBooking._id);
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

    console.log("Successfully updated booking to paid:", existingBooking._id);

    // Also update the Payment record
    const existingPayment = await Payment.findOne({ transactionUuid: transaction_uuid });
    if (existingPayment) {
      existingPayment.status = "completed";
      existingPayment.paymentReference = transaction_code || statusData.ref_id || "";
      existingPayment.paymentDetails = decoded;
      await existingPayment.save();
      console.log("Successfully updated payment record to completed:", existingPayment._id);
    } else {
      // Create it if it doesn't exist (e.g. if initiation was different)
      await Payment.create({
        user: existingBooking.user,
        booking: existingBooking._id,
        amount: Number(total_amount),
        transactionUuid: transaction_uuid,
        paymentMethod: "esewa",
        status: "completed",
        paymentReference: transaction_code || statusData.ref_id || "",
        paymentDetails: decoded,
      });
      console.log("Created missing payment record for completed transaction");
    }

    return res.status(200).json({
      message: "Payment verified successfully and booking confirmed",
      booking: existingBooking,
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

// @desc  Cancel a pending booking when eSewa payment fails/is cancelled
// @route DELETE /api/payments/esewa/cancel-pending/:transactionUuid
// @access Public (called from EsewaFailure page)
export const cancelPendingPayment = async (req, res) => {
  try {
    const { transactionUuid } = req.params;

    if (!transactionUuid) {
      return res.status(400).json({ message: "Missing transaction UUID" });
    }

    const booking = await Booking.findOne({
      transactionUuid,
      status: "pending",
      paymentStatus: "pending",
    });

    if (!booking) {
      // Already cancelled or doesn't exist — that's fine
      return res.status(200).json({ message: "No pending booking found" });
    }

    booking.status = "cancelled";
    booking.refundAmount = 0;
    booking.refundStatus = "none"; // "not_applicable" is not a valid enum value — use "none"
    await booking.save();

    // Mark the linked payment record as failed (never delete — preserves audit trail)
    await Payment.updateOne(
      { transactionUuid, status: { $ne: "completed" } },
      { $set: { status: "failed" } }
    );

    return res.status(200).json({ message: "Pending booking cancelled successfully" });
  } catch (error) {
    console.error("cancelPendingPayment error:", error);
    return res.status(500).json({ message: "Server error" });
  }
};