const User=require('../models/User');
const bcrypt=require('bcryptjs');
const jwt=require('jsonwebtoken');
const expressJwt=require('express-jwt')
const cookieParser=require('cookie-parser')
exports.registration=(req,res)=>{

    console.log(req.body);
    const newUser=new User({
        name:req.body.name,
        email:req.body.email,
        password:req.body.password,

    });

    bcrypt.genSalt(10,(err,salt)=>{
        bcrypt.hash(newUser.password,salt,(error,hash)=>{
            if(error)
            throw error;
            else{
                newUser.password=hash;
                newUser.save()
                .then(async user=>{
                    res.json(user);
                })
                .catch(err=>{
                    console.log(err);
                    return;
                })
            }
        })
    })

}

exports.login=(req,res)=>{
    const {email,password}=req.body;
    User.findOne({email:email},(err,user)=>{
        if(err || !user)
        {
            console.log("No user registered with this email id. Register now!")
           return res.status(401).json({error:"Register now!"});
        }
        else{
            bcrypt.compare(password,user.password,(error,result)=>{

                if(error || !result)
                {
                    return res.status(401).json({error:"Authentication mismatch"});
                }
                else{
                    const token=jwt.sign({_id:user._id},process.env.JWT_SECRET);
                    res.cookie("t",token,{expire:new Date()+9999});

                    const {_id,name,email,role}=user;
                    return res.json({token,user:{_id,email,name,role}});
                    

                }
            })

        }
    })

}


exports.logout=(req,res)=>{

    res.clearCookie("t");
    res.json({msg:"Logout sucess"})
}

exports.requireSignIn=expressJwt({
    secret:process.env.JWT_SECRET,
    userProperty:"auth",
    algorithms: ['sha1', 'RS256', 'HS256']
});


exports.isAuth=(req,res,next)=>{
    let user=req.profile && req.auth && req.profile._id==req.auth._id;
    if(!user)
    {

        return res.status(403).json({err:"access denied!",authId:req.auth._id,profileID:req.profile._id});
    }
   next();
}


exports.isAdmin=(req,res,next)=>{
    if(req.profile.role===0)
    {
        return res.status(403).json({err:"admin access denied"});
    }
    next();
}