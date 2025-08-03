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


// middleware
app.use(express.json());
app.use(cookieParser());

// Handle preflight requests
app.options('*', cors());

const allowedOrigins = [
  "http://localhost:3000",
  "https://neo-shiksha-app.vercel.app", // Your frontend domain
];

// Alternative more permissive CORS configuration (uncomment if needed for testing)
// app.use(cors({
//   origin: true,
//   credentials: true
// }));

app.use(
  cors({
    origin: function (origin, callback) {
      console.log('CORS request from origin:', origin);
      
      // Allow requests with no origin (like mobile apps or curl requests)
      if (!origin) {
        console.log('Allowing request with no origin');
        return callback(null, true);
      }
      
      // Check if the origin is in our allowed list
      if (allowedOrigins.includes(origin)) {
        console.log('Origin allowed:', origin);
        return callback(null, true);
      }
      
      // For development, you might want to allow all origins
      if (process.env.NODE_ENV === 'development') {
        console.log('Development mode - allowing all origins');
        return callback(null, true);
      }
      
      console.log('Origin not allowed:', origin);
      callback(new Error("CORS not allowed for this origin"));
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'x-csrf-token'],
    exposedHeaders: ['*', 'Authorization']
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