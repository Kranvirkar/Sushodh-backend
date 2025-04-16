const express = require("express");
const router = express.Router();
const { createPayment, handlePhonePeWebhook, checkPaymentStatus, getPaymentHistory} = require("../controllers/paymentController");

/**
 * @swagger
 * /api/create-payment:
 *   post:
 *     summary: Create a new payment
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - email
 *               - mobileNumber
 *               - amount
 *             properties:
 *               name:
 *                 type: string
 *                 example: Kiran Kumar
 *               email:
 *                 type: string
 *                 example: kiran@example.com
 *               mobileNumber:
 *                 type: string
 *                 example: "9623240111"
 *               amount:
 *                 type: number
 *                 example: 1
 *     responses:
 *       200:
 *         description: Payment created successfully
 *       400:
 *         description: Bad request
 */
router.post("/create-payment", createPayment);
router.post('/webhook', handlePhonePeWebhook);

/**
 * @swagger
 * /api/status/{merchantTransactionId}:
 *   get:
 *     summary: Check the payment status using the merchant transaction ID
 *     parameters:
 *       - in: path
 *         name: merchantTransactionId
 *         required: true
 *         schema:
 *           type: string
 *         description: The transaction ID provided by the merchant
 *     responses:
 *       200:
 *         description: Payment status retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: SUCCESS
 *                 amount:
 *                   type: number
 *                   example: 1
 *                 transactionId:
 *                   type: string
 *                   example: TXN123456
 *       404:
 *         description: Transaction not found
 */
router.get('/status/:merchantTransactionId', checkPaymentStatus);

/**
 * @swagger
 * /api/history:
 *   get:
 *     summary: Get payment history for a specific user
 *     parameters:
 *       - in: query
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the user whose payment history is being requested
 *     responses:
 *       200:
 *         description: A list of payment history records
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   transactionId:
 *                     type: string
 *                     example: TXN123456
 *                   amount:
 *                     type: number
 *                     example: 1
 *                   status:
 *                     type: string
 *                     example: SUCCESS
 *                   createdAt:
 *                     type: string
 *                     format: date-time
 *                     example: "2025-04-11T10:00:00Z"
 *       400:
 *         description: Missing or invalid userId
 */
router.get('/history', getPaymentHistory);

module.exports = router;
