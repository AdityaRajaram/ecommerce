const Category=require('../models/category');
const bodyParser=require('body-parser');

exports.create=(req,res)=>{
    const {name}=req.body;
    const newCategory= new Category({
        name:name
    });
    newCategory.save((err,data)=>{
        if(err)
        {
            res.status(400).json({
                err
            })
        }
        else{
            res.json({data});
        }
    })

}

//categoryById parameter
exports.categoryById=(req,res,next,id)=>{
    Category.findById(id).exec((err,data)=>{
        if(err || !data)
        {
            return res.status(400).json({msg:"No category found"});
        }
        req.category=data;
        next();
    })
}


//read category by data
exports.read=(req,res)=>{
    if(req.category)
    {
        return res.status(200).json(req.category);
    }
}

//update by Id

exports.updated=(req,res)=>{
    const category=req.category;
    category.name=req.body.name;
    category.save((err,data)=>{
        if(err||!data)
        {
            return res.status(400).json({msg:"Can't update"})
        }
        res.json(data);
    })
}

exports.remove=(req,res)=>{
    const category=req.category;
    category.name=req.body.name;
    category.remove((err,data)=>{
        if(err||!data)
        {
            return res.status(400).json({msg:"Can't update"})
        }
        res.status(200).json({msg:"successfully category removed"});
    })
}

exports.list=(req,res)=>{
    Category.find().exec((err,data)=>{
        if(err||!data)
        {
            return res.status(400).json({msg:"No category found"})

        }
        res.json(data);
    })
}