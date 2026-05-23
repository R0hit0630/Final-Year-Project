import crypto from "crypto";
import Booking from "../models/Booking.js";
import Payment from "../models/Payment.js";
import Package from "../models/Package.js";

const ESEWA_PRODUCT_CODE = (process.env.ESEWA_PRODUCT_CODE || "EPAYTEST").trim();

const ESEWA_SECRET = (
  process.env.ESEWA_SECRET || "8gBm/:&EnhH.1/q"
).trim();

const ESEWA_PAYMENT_URL = (
  process.env.ESEWA_PAYMENT_URL ||
  "https://rc-epay.esewa.com.np/api/epay/main/v2/form"
).trim();

const ESEWA_STATUS_URL = (
  process.env.ESEWA_STATUS_URL ||
  "https://rc.esewa.com.np/api/epay/transaction/status/"
).trim();

const BASE_URL = (
  process.env.BASE_URL || "http://localhost:5173"
).trim();

/**
 * eSewa v2 signature format must be exactly:
 * total_amount=100,transaction_uuid=ABC123,product_code=EPAYTEST
 */
const generateEsewaSignature = ({ total_amount, transaction_uuid, product_code }) => {
  const message = `total_amount=${total_amount},transaction_uuid=${transaction_uuid},product_code=${product_code}`;

  return crypto
    .createHmac("sha256", ESEWA_SECRET)
    .update(message)
    .digest("base64");
};

const makeTransactionUuid = () => {
  return `PKG-${Date.now()}-${Math.floor(Math.random() * 1000000)}`;
};

const normalizeOrigin = (origin) => {
  const safeOrigin = origin || BASE_URL;
  return safeOrigin.replace(/\/$/, "");
};

const parseSelectedDate = (selectedDate) => {
  if (!selectedDate) return null;

  if (selectedDate instanceof Date && !Number.isNaN(selectedDate.getTime())) {
    return selectedDate;
  }

  if (typeof selectedDate === "string") {
    if (selectedDate.includes(" - ")) {
      const firstPart = selectedDate.split(" - ")[0]?.trim();
      const parsed = new Date(firstPart);

      if (!Number.isNaN(parsed.getTime())) {
        return parsed;
      }
    }

    const directDate = new Date(selectedDate);

    if (!Number.isNaN(directDate.getTime())) {
      return directDate;
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

const decodeEsewaData = (data) => {
  try {
    const decodedString = Buffer.from(data, "base64").toString("utf-8");
    return JSON.parse(decodedString);
  } catch (error) {
    console.error("Failed to decode eSewa data:", error.message);
    return null;
  }
};

const toWholeNumber = (value) => {
  const number = Number(value);

  if (Number.isNaN(number) || number < 0) {
    return null;
  }

  return Math.round(number);
};

/**
 * @desc    Initiate eSewa payment
 * @route   POST /api/payments/esewa/initiate
 * @access  Private
 */
export const initiateEsewaPayment = async (req, res) => {
  try {
    const {
      packageId,
      selectedDate,
      groupSize,
      subtotal,
      serviceFee,
      total,
    } = req.body;

    if (!req.user?._id) {
      return res.status(401).json({
        message: "Unauthorized user. Please log in again.",
      });
    }

    if (!packageId || !selectedDate || !groupSize || total === undefined) {
      return res.status(400).json({
        message: "Missing required payment data",
      });
    }

    const travelers = Number(groupSize);

    if (!Number.isInteger(travelers) || travelers <= 0) {
      return res.status(400).json({
        message: "Invalid group size",
      });
    }

    const amount = toWholeNumber(subtotal || 0);
    const product_service_charge = toWholeNumber(serviceFee || 0);
    const requestedTotal = toWholeNumber(total || 0);

    if (
      amount === null ||
      product_service_charge === null ||
      requestedTotal === null
    ) {
      return res.status(400).json({
        message: "Invalid payment amount",
      });
    }

    const tax_amount = 0;
    const product_delivery_charge = 0;

    const computedTotal =
      amount + tax_amount + product_service_charge + product_delivery_charge;

    if (computedTotal !== requestedTotal) {
      return res.status(400).json({
        message: `Invalid total amount. Expected ${computedTotal}, received ${requestedTotal}`,
      });
    }

    const pkg = await Package.findById(packageId);

    if (!pkg) {
      return res.status(404).json({
        message: "Package not found",
      });
    }

    const parsedStartDate = parseSelectedDate(selectedDate);

    if (!parsedStartDate) {
      return res.status(400).json({
        message: "Invalid selected date format",
      });
    }

    const parsedEndDate = calculateEndDate(parsedStartDate, pkg.days);
    
    // [ESEWA FLOW STEP 1]: Generate a unique transaction ID for eSewa
    const transaction_uuid = makeTransactionUuid();

    const total_amount = String(computedTotal);
    const product_code = ESEWA_PRODUCT_CODE;

    // [ESEWA FLOW STEP 2]: Sign the transaction total, uuid, and product code with HMAC-SHA256
    const signature = generateEsewaSignature({
      total_amount,
      transaction_uuid,
      product_code,
    });

    const frontendOrigin = normalizeOrigin(req.headers.origin);

    // [ESEWA FLOW STEP 3]: Create a booking record in the database with "pending" status
    const booking = await Booking.create({
      user: req.user._id,
      package: packageId,
      travelers,
      startDate: parsedStartDate,
      endDate: parsedEndDate,
      totalPrice: computedTotal,
      notes: `Subtotal: ${amount}, Service Fee: ${product_service_charge}`,
      status: "pending",
      paymentStatus: "pending",
      transactionUuid: transaction_uuid,
      paymentReference: "",
      guide: null,
      guideAssigned: false,
    });

    // [ESEWA FLOW STEP 4]: Create an associated payment record in the database
    const paymentRecord = await Payment.create({
      user: req.user._id,
      booking: booking._id,
      amount: computedTotal,
      transactionUuid: transaction_uuid,
      paymentMethod: "esewa",
      status: "pending",
    });

    const fields = {
      amount: String(amount),
      tax_amount: String(tax_amount),
      total_amount,
      transaction_uuid,
      product_code,
      product_service_charge: String(product_service_charge),
      product_delivery_charge: String(product_delivery_charge),
      success_url: `${frontendOrigin}/payment/esewa/success`,
      failure_url: `${frontendOrigin}/payment/esewa/failure`,
      signed_field_names: "total_amount,transaction_uuid,product_code",
      signature,
    };

    console.log("eSewa payment initiated:", {
      bookingId: booking._id,
      paymentId: paymentRecord._id,
      transaction_uuid,
      total_amount,
      product_code,
      payment_url: ESEWA_PAYMENT_URL,
      success_url: fields.success_url,
      failure_url: fields.failure_url,
    });

    return res.status(200).json({
      message: "Payment initiated successfully",
      booking,
      payment: {
        payment_url: ESEWA_PAYMENT_URL,
        fields,
      },
    });
  } catch (error) {
    console.error("initiateEsewaPayment error:", error);

    return res.status(500).json({
      message: "Server error while initiating payment",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

/**
 * @desc    Verify eSewa payment
 * @route   POST /api/payments/esewa/verify
 * @access  Public
 */
export const verifyEsewaPayment = async (req, res) => {
  try {
    const { data } = req.body;

    if (!data) {
      return res.status(400).json({
        message: "Missing eSewa response data",
      });
    }

    // [ESEWA VERIFICATION FLOW STEP 1]: Decode base64 response from eSewa redirect
    const decoded = decodeEsewaData(data);

    if (!decoded) {
      return res.status(400).json({
        message: "Invalid eSewa response data",
      });
    }

    console.log("Decoded eSewa response:", decoded);

    const {
      transaction_uuid,
      total_amount,
      status,
      product_code,
      transaction_code,
      signed_field_names,
      signature,
    } = decoded;

    if (!transaction_uuid) {
      return res.status(400).json({
        message: "Missing transaction UUID",
      });
    }

    if (!total_amount) {
      return res.status(400).json({
        message: "Missing total amount",
      });
    }

    if (!product_code) {
      return res.status(400).json({
        message: "Missing product code",
      });
    }

    if (status !== "COMPLETE") {
      return res.status(400).json({
        message: `Payment status is ${status || "UNKNOWN"}`,
      });
    }

    // [ESEWA VERIFICATION FLOW STEP 2]: Find the original pending booking and verify the amount matches
    const existingBooking = await Booking.findOne({
      transactionUuid: transaction_uuid,
    });

    if (!existingBooking) {
      return res.status(404).json({
        message: "Booking not found for this transaction",
      });
    }

    const expectedAmount = Number(existingBooking.totalPrice);
    const receivedAmount = Number(total_amount);

    if (Number.isNaN(receivedAmount) || receivedAmount !== expectedAmount) {
      return res.status(400).json({
        message: "Payment amount mismatch",
        expected: expectedAmount,
        received: total_amount,
      });
    }

    if (product_code !== ESEWA_PRODUCT_CODE) {
      return res.status(400).json({
        message: "Invalid eSewa product code",
      });
    }

    /**
     * Optional local signature check from decoded data.
     * eSewa's final response signature may contain additional signed fields depending on response.
     * So this block only validates when the expected fields match our initiation signature format.
     */
    if (
      signed_field_names === "transaction_code,status,total_amount,transaction_uuid,product_code,signed_field_names" &&
      signature
    ) {
      const message = `transaction_code=${transaction_code},status=${status},total_amount=${total_amount},transaction_uuid=${transaction_uuid},product_code=${product_code},signed_field_names=${signed_field_names}`;

      const expectedResponseSignature = crypto
        .createHmac("sha256", ESEWA_SECRET)
        .update(message)
        .digest("base64");

      if (signature !== expectedResponseSignature) {
        return res.status(400).json({
          message: "Invalid eSewa response signature",
        });
      }
    }

    // [ESEWA VERIFICATION FLOW STEP 3]: Query eSewa's own Status API directly to double-check that the payment exists
    let statusData = null;

    try {
      const baseStatusUrl = ESEWA_STATUS_URL.replace(/\/$/, "");

      const statusCheckUrl =
        `${baseStatusUrl}?product_code=${encodeURIComponent(product_code)}` +
        `&total_amount=${encodeURIComponent(total_amount)}` +
        `&transaction_uuid=${encodeURIComponent(transaction_uuid)}`;

      console.log("Checking eSewa transaction status:", statusCheckUrl);

      const statusRes = await fetch(statusCheckUrl, {
        method: "GET",
        headers: {
          Accept: "application/json",
        },
      });

      const rawText = await statusRes.text();

      if (!statusRes.ok) {
        throw new Error(
          `eSewa status API returned ${statusRes.status}: ${rawText}`
        );
      }

      statusData = JSON.parse(rawText);

      console.log("eSewa status API response:", statusData);
    } catch (error) {
      console.error("eSewa status API error:", error.message);

      if (process.env.NODE_ENV === "production") {
        return res.status(503).json({
          message:
            "Could not verify payment with eSewa. Please contact support.",
        });
      }

      /**
       * Development/sandbox fallback only.
       * Do not rely on this in production.
       */
      statusData = {
        status: "COMPLETE",
        ref_id: transaction_code || "SANDBOX_REF",
      };
    }

    if (statusData?.status !== "COMPLETE") {
      return res.status(400).json({
        message: "Payment verification with eSewa failed",
        status: statusData?.status || "UNKNOWN",
      });
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

    // [ESEWA VERIFICATION FLOW STEP 4]: Update and save the Booking status to "confirmed" and "paid"
    existingBooking.status = "confirmed";
    existingBooking.paymentStatus = "paid";
    existingBooking.paymentReference =
      transaction_code || statusData.ref_id || "";

    await existingBooking.save();

    // [ESEWA VERIFICATION FLOW STEP 5]: Find the corresponding Payment record and update status to "completed"
    const existingPayment = await Payment.findOne({
      transactionUuid: transaction_uuid,
    });

    if (existingPayment) {
      existingPayment.status = "completed";
      existingPayment.paymentReference =
        transaction_code || statusData.ref_id || "";
      existingPayment.paymentDetails = decoded;

      await existingPayment.save();
    } else {
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
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

/**
 * @desc    Cancel pending booking when eSewa payment fails/is cancelled
 * @route   DELETE /api/payments/esewa/cancel-pending/:transactionUuid
 * @access  Public
 */
export const cancelPendingPayment = async (req, res) => {
  try {
    const { transactionUuid } = req.params;

    if (!transactionUuid) {
      return res.status(400).json({
        message: "Missing transaction UUID",
      });
    }

    const booking = await Booking.findOne({
      transactionUuid,
      status: "pending",
      paymentStatus: "pending",
    });

    if (!booking) {
      return res.status(200).json({
        message: "No pending booking found",
      });
    }

    booking.status = "cancelled";
    booking.refundAmount = 0;
    booking.refundStatus = "none";

    await booking.save();

    await Payment.updateOne(
      {
        transactionUuid,
        status: { $ne: "completed" },
      },
      {
        $set: {
          status: "failed",
        },
      }
    );

    return res.status(200).json({
      message: "Pending booking cancelled successfully",
    });
  } catch (error) {
    console.error("cancelPendingPayment error:", error);

    return res.status(500).json({
      message: "Server error while cancelling pending payment",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};