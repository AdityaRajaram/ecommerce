const express=require('express');
const bodyParser=require('body-parser');
const router=express.Router();

//controllers
const {create,read,productById,remove,update,list,relatedList,listCategories,listBySearch,photo,listSearch}=require('../controllers/product');
const {requireSignIn,isAuth,isAdmin}=require('../controllers/auth')
const {userById}=require('../controllers/user');


router.post('/product/create/:userId',requireSignIn,isAuth,isAdmin,create);
router.get('/product/:productId',read);

router.delete('/product/:productId/:userId',requireSignIn,isAuth,isAdmin,remove);

router.put('/product/:productId/:userId',requireSignIn,isAuth,isAdmin,update);


router.get('/products',list)

router.get('/products/search',listSearch)
//related products excluding requested product based on category
router.get('/products/related/:productId',relatedList);

router.get('/products/categories',listCategories);

router.post('/products/by/search',listBySearch)

//photo
router.get('/products/photo/:productId',photo);
router.param("productId",productById);
router.param("userId",userById);
module.exports=router