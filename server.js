const dotenv = require('dotenv');
const app = require('./app');

dotenv.config({ path: './Config.env' });

const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`✅ Server running on http://localhost:${port}`);
});
