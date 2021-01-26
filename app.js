require('dotenv').config();
const path=require('path');
const express=require('express');
const bodyParser=require('body-parser');
const mongoose=require('mongoose');
const cookieParser=require('cookie-parser')
const bcrypt=require('bcryptjs');
const connectDB = require('./config/connect');
const cors=require('cors')
const expressValidator=require('express-validator')
const app = express();
const expressJwt=require('express-jwt');

// connection to database
connectDB();



// middlewares

app.use(express.json());
mongoose.Promise = global.Promise;
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(cookieParser());
app.use(cors());
app.use(expressValidator());



// UserSchema
require('./models/User');
const User = mongoose.model('users');




const authRoute=require('./routes/auth');
app.use('/api',authRoute)

const userRoute=require('./routes/user');
app.use('/api',userRoute)


const categoryRoute=require('./routes/category');
app.use('/api',categoryRoute);



const braintreeRoute=require('./routes/braintree');
app.use('/api',braintreeRoute);


const orderRoute=require('./routes/order');
app.use('/api',orderRoute);

const productRoute=require('./routes/product');
const { response } = require('express');
app.use('/api',productRoute);



// app listening address
const port = process.env.PORT || 4000;
app.listen(port, (req, res) => {
    console.log(`Server is Running at ${port}`);
})