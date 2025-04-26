const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const paymentRoutes = require("./routes/paymentRoutes");
const sliderImageRoutes = require("./routes/sliderImageRoutes");
//const connectDB = require("./config/dbConfig");
const { swaggerUi, specs } = require("./swagger");
const { port } = require("./config/phonepeConfig");
const authRoutes = require('./routes/authRoutes');
const eventRoutes = require('./routes/event.routes');
const sequelize = require('./config/dbConfig');
const rateLimiter = require('./middelware/rateLimiter');
const helmet = require('helmet');
const errorHandler = require("./middelware/errorHandler");
const AppError = require("./utils/appError");
const globalErrorHandler = require('./controllers/errorController');

dotenv.config({path:'./Config.env'});
const app = express();
//connectDB();

app.use(helmet());
app.use(cors());
app.use(express.json());

sequelize.sync().then(() => {
    console.log('MySQL DB connected');
}).catch((err) => {
    console.error('DB connection error:', err);
});


app.use('/api/auth', authRoutes);
app.use("/api/events", eventRoutes);
//app.use(errorHandler);


app.use("/api/sliderImages", sliderImageRoutes);
app.use("/api", paymentRoutes);

// Swagger UI
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(specs));

/*app.all('*', (req, res, next) => {
    next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});*/

app.use(globalErrorHandler);

module.exports = app;