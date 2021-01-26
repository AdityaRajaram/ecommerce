const mongoose=require('mongoose');

const userSchema=new mongoose.Schema({
    name:{
        type:String,
        trim:true,
        required:true,
        maxlength:32
    },
    email:{
        type:String,
        trim:true,
        required:true,
        unique:true,
    },
    password:{
        type:String,
        required:true  
    },
    about:{
        type:String
    },
    salt:String,
    role:{
        type:Number,
        default:0,
    },
    history:{
        type:Array,
        default:[]

    }
},{timestamps:true})


//add virtual fields

// userSchema.virtual('password')
// .set(function(password){
//     this._password=password;
//     this.salt=uuidv1();
//     console.log("salt",this.salt);
//     this.hashed_password=this.encryptPassword(password,this.salt)
// }).get(function(){
//     return this._password;
// })


// userSchema.methods={
//     encryptPassword:function(password,salt){
//         console.log("pass",password)
//         if(!password)
//         return "";
//         try{
//             return crypto
//                 .createHmac("sha1",salt)
//                 .update(password)
//                 .digest("hex")

//         }catch(err){
//             return "";
//         }
//     }
// }
module.exports=mongoose.model('users',userSchema)