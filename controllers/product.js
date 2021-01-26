const Product=require('../models/product');
const formidable=require('formidable');
const _=require("lodash")
const fs=require('fs')


exports.productById=(req,res,next,id)=>{
    Product.findById(id)
    .populate('category')
    .exec((err,result)=>{
        if(err || !result)
        {
            res.status(404).json({msg:"No product found"});
        }
        else
        {
            req.product=result;
            next();

        }
    })
}




exports.create=(req,res)=>{
    let form=new formidable.IncomingForm();
    form.keepExtensions=true;
    form.parse(req,(err,fields,files)=>{
        if(err)
        {
            return res.status(400).json({
                err:"Image could not be uploaded"
            });
        }
        let product=new Product(fields);
        const {name,description,quantity,shipping,price,category}=fields;

        if(!name || !description||!quantity||!shipping||!price||!category)
        {
            return res.status(400).json({err:"In sufficient fields"});
        }
        if(files.photo)
        {
            if(files.photo.size>1000000)
            {
               return res.status(400).json({err:"File should be less than 1MB"});
            }
            product.photo.data=fs.readFileSync(files.photo.path);
            product.photo.contentType=files.photo.type;
        }
        product.save((err,result)=>{
            if(err)
            {
                return res.status(400).json({err});
            }
            res.json(result);
        })
    })
}

exports.read=(req,res)=>{
    req.product.photo=undefined;
    return res.json(req.product);
}


exports.remove=(req,res)=>{
    let product=req.product;
    product.remove((err,deletedProduct)=>{
        if(err||!deletedProduct)
        {
            res.status(400).json({deletedProduct,err:"product can't be deleted"});
        }
        return res.json({err:"product deleted successfully"});
    })
}





exports.update=(req,res)=>{
    let form=new formidable.IncomingForm();
    form.keepExtensions=true;
    form.parse(req,(err,fields,files)=>{
        if(err)
        {
            console.log("error=",err)
            return res.status(400).json({
                error:"Image could not be uploaded"
            });
        }
        let product=req.product;
        product=_.extend(product,fields);
        const {name,description,quantity,shipping,price,category}=fields;

        console.log(name,description,quantity,shipping,price,category);

        if(!name || !description||!quantity||!shipping||!price||!category)
        {
            return res.status(400).json({msg:"In sufficient fields"});
        }
        if(files.photo)
        {
            if(files.photo.size>1000000)
            {
                return res.status(400).json({msg:"File should be less than 1MB"});
            }
            product.photo.data=fs.readFileSync(files.photo.path);
            product.photo.contentType=files.photo.type;
        }
        product.save((err,result)=>{
            if(err)
            {
                return res.status(400).json({err});
            }
            return res.json(result);
        })
    })
}


exports.list=(req,res)=>{
    let order=req.query.order?req.query.order:"asc";
    let sortBy=req.query.sortBy?req.query.sortBy:"_id";
    let limit=req.query.limit?parseInt(req.query.limit):6;
    
    Product.find()
            .select("-photo")
            .populate("category")
            .sort([[sortBy,order]])
            .limit(limit)
            .exec((err,products)=>{
                if(err ||!products)
                {
                    return res.status(400).json({err:"Not found any"});
                }
                res.json(products);
            })
}


exports.relatedList=(req,res)=>{

    let limit=req.query.limit?parseInt(req.query.limit):6;

    Product.find({_id:{$ne:req.product},category:req.product.category})
            .limit(limit)
            .exec((err,list)=>{
                if(err||!list)
                {
                    return res.status(400).json({err:"Not found any relatable"});
                }
                res.json(list);
            })

}


//list distinct categories with product registered

exports.listCategories=(req,res)=>{
    Product.distinct("category",{},(err,categoriesList)=>{
        if(err||!categoriesList)
                {
                    return res.status(400).json({err:"Not found any relatable"});
                }
                res.json(categoriesList);

    })
    


}


exports.listBySearch=(req,res)=>{

    let order=req.body.order?req.body.order:"asc";
    let sortBy=req.body.sortBy?req.body.sortBy:"_id";
    let limit=req.body.limit?parseInt(req.body.limit):6;
    let skip=parseInt(req.body.skip);

    let findArgs={};

    for(let key in req.body.filters){
        if(req.body.filters[key].length>0)
        {
            if(key==="price")
            {
                findArgs[key]={
                    $gte:req.body.filters[key][0],
                    $lte:req.body.filters[key][1]
                };
            }
            else{
                findArgs[key]=req.body.filters[key];
            }
        }
    }

    Product.find(findArgs)
            .select("-photo")
            .populate("category")
            .sort([[sortBy,order]])
            .limit(limit)
            .exec((err,data)=>{
                if(err ||!data)
                {
                    return res.status(400).json({err:"Not found any"});
                }
                res.json({data,size:data.length});

            })

    

}


//photo

exports.photo=(req,res,next)=>{
    if(req.product.photo.data)
    {
        res.set('Content-Type',req.product.photo.contentType);
        return res.send(req.product.photo.data);
    }
    next();

}

exports.listSearch=(req,res)=>{
    const query={};
    if(req.query.search)
    {
        query.name={$regex:req.query.search,$options:'i'};
        if(req.query.category && req.query.category!=="All")
        {
            query.category=req.query.category;
        }

    }
    Product.find(query,(err,data)=>{
        if(err)
        {
            return  res.status(400).json({err:"Product not found"})
        }
        return res.json(data);
    }).select("-photo");
}


exports.decreaseQuantity=(req,res,next)=>
{

    let bulkOps=req.body.order.products.map((item)=>{
        return{
            updateOne:{
                filter:{_id:item._id},
                update:{
                    $inc:{
                        quantity:-item.count,
                        sold:+item.count
                    }
                }
            }
        };
    });

    Product.bulkWrite(bulkOps,{},(err,data)=>{
        if(err)
        {
            return res.status(400).json({err:"Can't decrease quantity in db"})
        }
        next();

    });


};