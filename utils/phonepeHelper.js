const crypto = require('crypto');

function generatePhonePeSignature(payload, saltKey) {
    const encodedPayload = JSON.stringify(payload);
    const dataToHash = encodedPayload + '/pg/v1/pay' + saltKey;
    const hash = crypto.createHash('sha256').update(dataToHash).digest('hex');
    return hash;
}

function verifyPhonePeSignature(payload, xVerifyHeader, saltKey) {
    const data = payload + '/pg/v1/status' + saltKey;
    const hash = crypto.createHash('sha256').update(data).digest('hex');
    return xVerifyHeader === hash;
}


const getPaymentStatusFromPhonePe = async (merchantTransactionId) => {
    const apiPath = `/pg/v1/status/${MERCHANT_ID}/${merchantTransactionId}`;
    const xVerify = generateXVerify(apiPath, MERCHANT_KEY, KEY_INDEX);

    const response = await axios.get(`${BASE_URL}${apiPath}`, {
        headers: {
            'Content-Type': 'application/json',
            'X-VERIFY': xVerify,
            'X-MERCHANT-ID': MERCHANT_ID,
            accept: 'application/json'
        }
    });

    return response.data;
};

module.exports = {
    generatePhonePeSignature,getPaymentStatusFromPhonePe,
    verifyPhonePeSignature
};
