const axios = require("axios");
const sha256 = require("sha256");
const { merchantId, baseUrl, saltKey, appBeUrl, saltIndex, fUrl, bUrl} = require("../config/phonepeConfig");
const uniqid = require("uniqid"); // or consider using uuid
const Payment = require('../models/Payment');
const {generatePhonePeSignature, getPaymentStatusFromPhonePe} = require("../utils/phonepeHelper");
const db = require('../config/dbConfig'); // path to your db.js


const apiPath = "/pg/v1/pay";


const createPayment = async (req, res) => {
    const { amount, mobileNumber,name,email } = req.body;

    // Basic validation
    if (!amount || amount <= 0) {
        return res.status(400).json({ success: false, message: "Invalid payment amount" });
    }

    if (!mobileNumber || !/^\d{10}$/.test(mobileNumber)) {
        return res.status(400).json({ success: false, message: "Invalid mobile number" });
    }

    const userId = "MUID123";
    const merchantTransactionId = `TXN-${uniqid()}` // Consider switching to UUID for better uniqueness

    const normalPayLoad = {
        merchantId,
        merchantTransactionId,
        merchantUserId: userId,
        amount: amount * 100, // Convert to paise
        redirectUrl: `${bUrl}/api/status/${merchantTransactionId}`,
        redirectMode: "REDIRECT",
        mobileNumber,
        callbackUrl: `${bUrl}/api/webhook`,
        paymentInstrument: {
            type: "PAY_PAGE",
        },
    };

    const bufferObj = Buffer.from(JSON.stringify(normalPayLoad), "utf8");
    const base64EncodedPayload = bufferObj.toString("base64");

    const stringToHash = base64EncodedPayload + apiPath + saltKey;
    const sha256Hash = sha256(stringToHash);
    const xVerifyChecksum = `${sha256Hash}###${saltIndex}`;
    console.log(`base64EncodedPayload: ${base64EncodedPayload}`)
    console.log(`xVerifyChecksum: ${xVerifyChecksum}`);
    console.log(`${baseUrl}${apiPath}`)
    try {
        const response = await axios.post(
            `${baseUrl}${apiPath}`,
            { request: base64EncodedPayload },
            {
                headers: {
                    "Content-Type": "application/json",
                    "X-VERIFY": xVerifyChecksum,
                    accept: "application/json",
                },
            }
        );

        const paymentLink = response.data.data.instrumentResponse.redirectInfo.url;

        // await Payment.create({
        //     merchantTransactionId,
        //     userId,
        //     amount,
        //     merchantId,
        //     paymentLink,
        //     status: 'PENDING',
        // });

        console.log(merchantTransactionId, mobileNumber, amount, merchantId, paymentLink,  name, email)
/*
        // Save to MySQL
        const insertQuery = `
            INSERT INTO payments 
                (merchantTransactionId, mobileNumber, amount, merchantId, paymentLink, status, name, email)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        `;

        const values = [
            merchantTransactionId,
            mobileNumber,
            amount,
            merchantId,
            paymentLink,
            'PENDING',
            name,
            email
        ];

        await db.query(insertQuery, values); // ✅ fixed query usage
*/

        await Payment.create({
            merchantTransactionId,
            mobileNumber,
            amount,
            merchantId,
            paymentLink,
            status: 'PENDING',
            name,
            email
        });

        console.log(`[Payment Initiated] Transaction ID: ${merchantTransactionId}`);

        res.status(200).json({
            success: true,
            qrUrl: paymentLink,
        });

        // Optional: Log response in dev mode
        if (process.env.NODE_ENV === "development") {
            console.log("PhonePe response:", response.data);
        }

    } catch (error) {
        console.error(error);
        console.error("PhonePe payment creation error:", error.response?.data || error.message);

        res.status(500).json({
            success: false,
            message: "Payment creation failed",
            error: error.response?.data || error.message,
        });
    }
};


/*const createPayment = async (req, res) => {
    const { amount, mobNumber, name, email } = req.body;

    // Basic validation
    if (!amount || amount <= 0) {
        return res.status(400).json({ success: false, message: "Invalid payment amount" });
    }

    if (!mobNumber || !/^\d{10}$/.test(mobNumber)) {
        return res.status(400).json({ success: false, message: "Invalid mobile number" });
    }

    const userId = "MUID123";
    const merchantTransactionId = `TXN-${uniqid()}`; // You could use UUID here for stronger uniqueness

    const normalPayLoad = {
        merchantId,
        merchantTransactionId,
        merchantUserId: userId,
        amount: amount * 100, // Convert to paise
        redirectUrl: `${bUrl}/api/status/${merchantTransactionId}`,
        redirectMode: "REDIRECT",
        mobileNumber: mobNumber,
        callbackUrl: `${bUrl}/api/webhook`,
        paymentInstrument: {
            type: "PAY_PAGE",
        },
    };

    const bufferObj = Buffer.from(JSON.stringify(normalPayLoad), "utf8");
    const base64EncodedPayload = bufferObj.toString("base64");

    const stringToHash = base64EncodedPayload + apiPath + saltKey;
    const sha256Hash = sha256(stringToHash);
    const xVerifyChecksum = `${sha256Hash}###${saltIndex}`;

    console.log(`base64EncodedPayload: ${base64EncodedPayload}`);
    console.log(`xVerifyChecksum: ${xVerifyChecksum}`);
    console.log(`${baseUrl}${apiPath}`);

    try {
        const response = await axios.post(
            `${baseUrl}${apiPath}`,
            { request: base64EncodedPayload },
            {
                headers: {
                    "Content-Type": "application/json",
                    "X-VERIFY": xVerifyChecksum,
                    accept: "application/json",
                },
            }
        );

        const paymentLink = response.data?.data?.instrumentResponse?.redirectInfo?.url;
        if (!paymentLink) {
            throw new Error("Failed to retrieve payment link");
        }

        // Save to MySQL
        const insertQuery = `
            INSERT INTO payments 
                (merchantTransactionId, mobNumber, amount, merchantId, paymentLink, status, name, email)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        `;
        const values = [
            merchantTransactionId,
            mobNumber,
            amount,
            merchantId,
            paymentLink,
            'PENDING',
            name,
            email
        ];

        await new Promise((resolve, reject) => {
            query(insertQuery, values, (err, result) => {
                if (err) {
                    return reject(err);
                }
                resolve(result);
            });
        });

        console.log(`[Payment Initiated] Transaction ID: ${merchantTransactionId}`);

        res.status(200).json({
            success: true,
            qrUrl: paymentLink,
        });

        if (process.env.NODE_ENV === "development") {
            console.log("PhonePe response:", response.data);
        }

    } catch (error) {
        console.error("PhonePe payment creation error:", {
            message: error.message,
            response: error.response?.data,
        });

        res.status(500).json({
            success: false,
            message: "Payment creation failed",
            error: error.response?.data || error.message,
        });
    }
};*/

/*const handlePhonePeWebhook = async (req, res) => {
    const data = req.body;
    console.log("[PhonePe Webhook Received]:", JSON.stringify(data));

    try {
        // Validate required fields
        const transactionData = data?.data;
        if (!transactionData?.merchantTransactionId || !transactionData?.paymentStatus) {
            console.warn("Invalid webhook data format:", data);
            return res.status(400).send("Invalid data format");
        }

        const { merchantTransactionId, providerReferenceId, paymentStatus } = transactionData;
        const status = paymentStatus === 'SUCCESS' ? 'SUCCESS' : 'FAILED';

        const result = await Payment.updateOne(
            { merchantTransactionId },
            {
                $set: {
                    status,
                    providerReferenceId,
                    rawWebhookData: data,
                    updatedAt: new Date(),
                },
            }
        );

        if (result.matchedCount === 0) {
            console.warn(`No payment record found for transaction ID: ${merchantTransactionId}`);
        } else {
            console.log(`Payment updated: ${merchantTransactionId} -> ${status}`);
        }

        return res.status(200).send('Webhook received');
    } catch (err) {
        console.error("Error processing webhook:", err);
        return res.status(500).send('Error processing webhook');
    }
};*/

const handlePhonePeWebhook = async (req, res) => {
    const data = req.body;
    console.log("[PhonePe Webhook Received]:", JSON.stringify(data));

    try {
        const transactionData = data?.data;

        // ✅ Validate webhook structure
        if (
            !transactionData?.merchantTransactionId ||
            !transactionData?.paymentStatus ||
            typeof transactionData?.merchantTransactionId !== 'string'
        ) {
            console.warn("Invalid webhook data format:", data);
            return res.status(400).send("Invalid data format");
        }

        const { merchantTransactionId, providerReferenceId, paymentStatus } = transactionData;
        const status = paymentStatus === 'SUCCESS' ? 'SUCCESS' : 'FAILED';

        const updateQuery = `
            UPDATE payments 
            SET status = ?, 
                providerReferenceId = ?, 
                webhookData = ?, 
                updatedAt = NOW() 
            WHERE merchantTransactionId = ?
        `;

        const values = [
            status,
            providerReferenceId || null,
            JSON.stringify(data),
            merchantTransactionId
        ];

        // ✅ Perform the DB update
        const result = await new Promise((resolve, reject) => {
            db.query(updateQuery, values, (err, result) => {
                if (err) return reject(err);
                resolve(result);
            });
        });

        if (result.affectedRows === 0) {
            console.warn(`[PhonePe Webhook] No record found for TXN: ${merchantTransactionId}`);
        } else {
            console.log(`[PhonePe Webhook] TXN: ${merchantTransactionId} updated to ${status}`);
        }

        return res.status(200).send("Webhook received");
    } catch (err) {
        console.error("Webhook processing error:", err);
        return res.status(500).send("Server error");
    }
};


/*
const checkPaymentStatus = async (req, res) => {
    const { merchantTransactionId } = req.params;

    const successUrl = `${fUrl}/payment-success`;
    const failureUrl = `${fUrl}/payment-failure`;

    const apiPath = `/pg/v1/status/${merchantId}/${merchantTransactionId}`;
    const stringToHash = apiPath + saltKey;
    const xVerify = sha256(stringToHash).toString() + '###' + saltIndex;

    try {
        const response = await axios.get(`${baseUrl}${apiPath}`, {
            headers: {
                'Content-Type': 'application/json',
                'X-VERIFY': xVerify,
                'X-MERCHANT-ID': merchantId,
                'accept': 'application/json'
            }
        });

        const data = response.data;

        if (data?.success && data?.data) {
            const state = data.data.state;
            const paymentStatus = state === 'COMPLETED' ? 'SUCCESS' :
                state === 'FAILED' ? 'FAILED' : 'PENDING';

            // 🔄 Update the DB
            await Payment.updateOne(
                { merchantTransactionId },
                {
                    $set: {
                        status: paymentStatus,
                        providerReferenceId: data.data.transactionId,
                        responseCode: data.data.responseCode,
                        responseData: data,
                        updatedAt: new Date()
                    }
                }
            );

            // 🎯 Redirect based on final status
            if (paymentStatus === 'SUCCESS') {
                return res.redirect(`${successUrl}?transactionId=${merchantTransactionId}`);
            } else {
                return res.redirect(`${failureUrl}?transactionId=${merchantTransactionId}`);
            }
        }

        // Unexpected structure or not successful
        return res.redirect(`${failureUrl}?transactionId=${merchantTransactionId}`);

    } catch (error) {
        console.error("Status check failed:", error?.response?.data || error.message);
        return res.redirect(`${failureUrl}?transactionId=${merchantTransactionId}`);
    }
};
*/


const checkPaymentStatus = async (req, res) => {
    const { merchantTransactionId } = req.params;

    if (!merchantTransactionId || typeof merchantTransactionId !== 'string') {
        return res.status(400).json({ success: false, message: 'Invalid transaction ID' });
    }

    const successUrl = `${fUrl}/payment-success`;
    const failureUrl = `${fUrl}/payment-failure`;
    const apiPath = `/pg/v1/status/${merchantId}/${merchantTransactionId}`;
    const stringToHash = apiPath + saltKey;
    const xVerify = sha256(stringToHash).toString() + '###' + saltIndex;

    try {
        const response = await axios.get(`${baseUrl}${apiPath}`, {
            headers: {
                'Content-Type': 'application/json',
                'X-VERIFY': xVerify,
                'X-MERCHANT-ID': merchantId,
                'accept': 'application/json'
            }
        });

        const data = response.data;

        if (data?.success && data?.data) {
            const state = data.data.state;
            const paymentStatus = state === 'COMPLETED' ? 'SUCCESS' :
                state === 'FAILED' ? 'FAILED' : 'PENDING';

            console.log(`[Status Check] TXN: ${merchantTransactionId} -> ${state}`);

            // const updateQuery = `
            //     UPDATE payments
            //     SET status = ?,
            //         providerReferenceId = ?,
            //         responseCode = ?,
            //         responseData = ?,
            //         updatedAt = NOW()
            //     WHERE merchantTransactionId = ?
            // `;
            //
            // const values = [
            //     paymentStatus,
            //     data.data.transactionId,
            //     data.data.responseCode,
            //     JSON.stringify(data),
            //     merchantTransactionId
            // ];
            //
            // try {
            //     await db.query(updateQuery, values);
            //     console.log(`[Payment Updated] TXN: ${merchantTransactionId} Status: ${paymentStatus}`);
            // } catch (err) {
            //     console.error("Error updating payment record:", err);
            // }

            try {
                await Payment.update(
                    {
                        status: paymentStatus,
                        providerReferenceId: data.data.transactionId,
                        responseCode: data.data.responseCode,
                        responseData: JSON.stringify(data),
                        updatedAt: new Date(), // Sequelize will auto-update if timestamps are enabled
                    },
                    {
                        where: { merchantTransactionId }
                    }
                );

                console.log(`[Payment Updated] TXN: ${merchantTransactionId} Status: ${paymentStatus}`);
            } catch (err) {
                console.error("Error updating payment record:", err);
            }

            return res.redirect(`${paymentStatus === 'SUCCESS' ? successUrl : failureUrl}?transactionId=${merchantTransactionId}`);
        }

        return res.redirect(`${failureUrl}?transactionId=${merchantTransactionId}`);
    } catch (error) {
        console.error("Status check failed:", error?.response?.data || error.message);
        return res.redirect(`${failureUrl}?transactionId=${merchantTransactionId}`);
    }
};


const getPaymentHistory = async (req, res) => {
    const userId = req.query.userId?.trim();
    if (!userId) {
        return res.status(400).json({
            success: false,
            message: "Missing 'userId' in query parameters."
        });
    }

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;

    try {
        const [payments, total] = await Promise.all([
            Payment.findAll({
                attributes: [
                    'id', 'merchantTransactionId', 'mobileNumber', 'amount',
                    'merchantId', 'paymentLink', 'status', 'name', 'email',
                    'createdAt', 'updatedAt'
                ],
                where: { merchantId: userId },
                order: [['createdAt', 'DESC']],
                limit,
                offset
            }),
            Payment.count({ where: { merchantId: userId } })
        ]);

        return res.status(200).json({
            success: true,
            count: payments.length,
            total,
            page,
            limit,
            payments
        });

    } catch (error) {
        console.error("Error fetching payment history:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to fetch payment history",
            error: error.message
        });
    }
};


module.exports = { createPayment ,handlePhonePeWebhook, checkPaymentStatus ,getPaymentHistory};
