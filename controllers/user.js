const User=require('../models/User');
const bcrypt=require('bcryptjs')
const {Order} =require('../models/order')

exports.userById=(req,res,next,id)=>{

    User.findById(id).exec((err,user)=>{
        if(err || !user)
        {
            return res.status(400).json({
                err:"user not found"
            })
        }
        else
        {
            req.profile=user;
            next();
        }
    })

}


exports.read=(req,res)=>{
    req.profile.createdAt=undefined;
    req.profile.password=undefined;
    req.profile.role=undefined;
    req.profile.updatedAt=undefined;
   return  res.json(req.profile);

}

exports.update=(req,res)=>{
   
    const password=req.body.password;
    var salt = bcrypt.genSaltSync(10);
    var hash = bcrypt.hashSync(password, salt);
    if(hash)
    {
        req.body.password=hash
    }
    console.log(req.body)
    User.findOneAndUpdate({_id:req.profile._id},{$set:req.body},{new:true},(err,data)=>{
        if(err || !data)
        {
            return res.status(400).json({
                err:"user not found and can't be updated"
            })
        }
        data.password=undefined;
      

        return res.json(data);
    })
}


exports.addOrderToUserHistory=(req,res,next)=>{
    let history=[];

    req.body.order.products.forEach((item)=>{
        history.push({
            _id:item._id,
            name:item.name,
            description:item.description,
            category:item.category,
            quantity:item.count,
            transaction_id:req.body.order.transaction_id,
            amount:req.body.order.amount
        })
    });

    User.findOneAndUpdate({_id:req.profile._id},{$push:{history:history}},{new:true},(err,data)=>{
        if(err)
        {
            return res.status(400).json({err:"couldn't update user purchase history"});
        }
        next();
    })
};


exports.purchaseHistory=(req,res)=>{
    Order.find({user:req.profile._id})
    .populate('user','_id name')
    .sort('-createdAt')
    .exec((err,data)=>{
        if(err)
        {
            return res.status(400).json({err:"couldn't retrive purchase history"})
        }
        else
        {
            return res.json(data);
        }
    });
};