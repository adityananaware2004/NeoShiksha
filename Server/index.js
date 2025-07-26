const express = require('express');
const app = express();
require("dotenv").config();
// import Routes

const userRoute = require('./routes/user');
const profileRoute = require('./routes/Profile');
const paymentRoute = require('./routes/Payment');
const courseRoute = require('./routes/course');

const database = require('./config/database');
const cookieParser = require('cookie-parser');
const cors = require('cors')
const {cloudinaryConnect} = require('./config/cloudinaryConnect');
const fileUpload = require('express-fileupload')
const dotenv = require('dotenv')
dotenv.config()

const PORT = process.env.PORT || 5000;

// database connection
database.dbconnect();

// middleware
app.use(express.json());
app.use(cookieParser());

app.use(cors({
  origin: "http://localhost:3000",
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}))

app.use(fileUpload({
    useTempFiles: true,
    tempFileDir: '/tmp'
}));

// cloudinary connection
cloudinaryConnect();

// routes
app.use('/api/v1/auth', userRoute);
app.use('/api/v1/profile', profileRoute);
app.use('/api/v1/payment', paymentRoute);
app.use('/api/v1/course', courseRoute);

// default route
app.get('/', (req, res) => {
    return res.status(200).json({
        success: true,
        message: "Your server is up and running"
    })
})


app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`)
})