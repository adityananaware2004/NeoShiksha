const express = require('express');
const app = express();
require("dotenv").config();
// import Routes

const userRoute = require('./routes/user');
const profileRoute = require('./routes/Profile');
const paymentRoute = require('./routes/Payment');
const courseRoute = require('./routes/course');
const contactroute= require('./routes/Contact');

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
database.dbconnect();

// middleware
app.use(express.json());
app.use(cookieParser());

const allowedOrigins = [
  "http://localhost:3000",
  "https://neo-shiksha-app.vercel.app/", // Your frontend domain
];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("CORS not allowed for this origin"));
      }
    },
    credentials: true,
  })
);


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
app.use('/api/v1/reach', contactroute);

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