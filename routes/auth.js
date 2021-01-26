const express=require('express');
const bodyParser=require('body-parser');
const router=express.Router();

//controllers
const { registration,login,logout,requireSignIn}=require('../controllers/auth')
const {userSignupValidator}=require('../validator/index')


router.post('/register',userSignupValidator,registration);


router.post('/login',login);


router.get('/logout',logout)


router.get('/hi',requireSignIn,(req,res)=>{
    res.send("hiiiii").json('jjjjjjj')

})

module.exports=router