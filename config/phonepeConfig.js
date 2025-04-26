const dotenv = require('dotenv');

dotenv.config({ path: './Config.env' });

module.exports = {
    port: process.env.PORT || 3001,
    merchantId: process.env.PHONEPe_MERCHANT_ID,
    saltKey: process.env.PHONEPe_SALT_KEY ,
    saltIndex: process.env.PHONEPe_SALT_INDEX ,
    baseUrl: process.env.PHONEPe_BASE_URL ,
    bUrl: process.env.BASE_URL,
    fUrl:process.env.FRONT_URL
    //peEndPath: process.env.PE_END_POINT,
};
