const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const {ObjectId} = mongoose.Schema;

const productSchema=new mongoose.Schema({
    name:{
        type:String,
        trim:true,
        required:true,
        maxlength:32
    },
    description:{
        type:String,
        required:true,
        maxlength:2000
    },
    price:{
        type:Number,
        trim:true,
        required:true,
        maxlength:32
    },
    category:{
            type:ObjectId,
            ref:'category',
            required:true

    },
    quantity:{
        type:Number,
        trim:true,
        required:true,
        maxlength:10
    },
    shipping:{
        type:Boolean,
        required:false,
    },
    photo:{
        data:Buffer,
        contentType:String
    },
    sold:{
        type:Number,
        default:0
    }
},{timestamps:true})


module.exports=mongoose.model('product',productSchema)