const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const paymentRoutes = require("./routes/paymentRoutes");
//const connectDB = require("./config/dbConfig");
const { swaggerUi, specs } = require("./swagger");
const { port } = require("./config/phonepeConfig");
const authRoutes = require('./routes/authRoutes');
const sequelize = require('./config/dbConfig');
const rateLimiter = require('./middelware/rateLimiter');
const helmet = require('helmet');

dotenv.config();
const app = express();
//connectDB();

app.use(helmet());
app.use(cors());
app.use(rateLimiter);
app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);

sequelize.sync().then(() => {
    console.log('MySQL DB connected');
}).catch((err) => {
    console.error('DB connection error:', err);
});

app.use("/api", paymentRoutes);

// Swagger UI
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(specs));



app.listen(port, () => {
    console.log(`✅ Server running on http://localhost:${port}`);
});
