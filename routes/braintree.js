const express=require('express');
const bodyParser=require('body-parser');
const router=express.Router();


const {requireSignIn,isAuth}=require('../controllers/auth')
const {userById}=require('../controllers/user');
const {getToken,processPayment}=require('../controllers/braintree')

router.get('/braintree/getToken/:userId',requireSignIn,isAuth,getToken)
router.post('/braintree/payment/:userId',requireSignIn,isAuth,processPayment)

router.param("userId",userById);

module.exports=router