const express=require('express');
const bodyParser=require('body-parser');
const router=express.Router();

//controllers
const {create,categoryById,read,updated,list,remove}=require('../controllers/category');
const {requireSignIn,isAuth,isAdmin}=require('../controllers/auth')
const {userById}=require('../controllers/user');
const category = require('../models/category');
const { route } = require('./product');


router.post('/category/create/:userId',requireSignIn,isAuth,isAdmin,create);

router.put('/category/:categoryId/:userId',requireSignIn,isAuth,isAdmin,updated)
router.post('/category/:categoryId/:userId',requireSignIn,isAuth,isAdmin,remove)

router.get('/categories',list);


router.get('/category/:categoryId',read)
router.param("categoryId",categoryById)

router.param("userId",userById);
module.exports=router