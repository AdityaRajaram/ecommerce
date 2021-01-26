const User=require('../models/User');
const braintree=require('braintree');
require('dotenv').config();


const gateway = new braintree.BraintreeGateway({
    environment:  braintree.Environment.Sandbox,
    merchantId:   process.env.BRAINTREE_MERCHANT_ID,
    publicKey:    process.env.BRAINTREE_PUBLIC_KEY,
    privateKey:   process.env.BRAINTREE_PRIVATE_KEY
});

exports.getToken=(req,res)=>{

    gateway.clientToken.generate({},function(err,response){
        if(err)
        {
            res.status(500).send(err)
        }
        else
        {
            res.send(response);
        }
    })


}

exports.processPayment=(req,res)=>{
    let nonceFromTheClient=req.body.paymentMethodNonce;
    let amountFromTheClient=req.body.amount;
    console.log(req.body)

    let newTransaction= gateway.transaction.sale({
        
        paymentMethodNonce:nonceFromTheClient,
        amount:amountFromTheClient,
        options:{
            submitForSettlement: true
        }

    },(error,result)=>{
        if(error)
        {
            console.log(error)
            return res.status(500).json({err:error})
        }
        else{
            return res.json(result)
        }
    })
}