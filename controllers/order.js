const {Order,CartItem} =require('../models/order')




exports.findOrderById = (req, res, next, id) => {
    Order.findById(id)
    .populate('products.product', 'name price')
    .exec((err, order) => {
        if (err || !order) {
            return res.status(400).json({
                error: errorHandler(err)
            });
        }

        req.order = order;

        next();
    });

};

exports.create=(req,res)=>{

    req.body.order.user=req.profile;
    console.log(req.body.order)

    const newOrder= new Order(req.body.order);
    newOrder.save((err,data)=>{
        if(err)
        {
            return res.status(400).json({err:"Couldn't save in db"});
        }
        else{
            return;
        }
    })
}

exports.listOrders=(req,res)=>{
    Order.find()
         .populate('user')
         .sort('-created')
         .exec((err,data)=>{
            if(err)
            {
                console.log(err);
                return res.status(400).json({err:"Couldn't retrive order list"});
            }
            else{
                console.log("sample",data);
                return res.status(200).json(data);
            }
        })
}


exports.updateOrderStatus = (req, res) => {
    Order.update(
        {_id: req.body.orderId},
        {$set: {status: req.body.status}},
        (err, order) => {
            if (err) {
                return res.status(400).json({
                    error: "Can't update status in db"
                });
            }

            res.json(order);
        }
    );
};

exports.getStatusValues = (req, res) => {
    res.json(Order.schema.path('status').enumValues);
};