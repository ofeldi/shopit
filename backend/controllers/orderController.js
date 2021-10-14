const Order = require('../models/order');
const Product = require('../models/product');

const ErrorHandler = require('../utils/errorHandler');
const catchAsyncErrors = require('../middlewares/catchAsyncErrors');

const APIFeatures = require('../utils/apiFeatures');

// Create a new order => /api/v1/order/new 
exports.newOrder = catchAsyncErrors(async (req, res, next) => {
    const {
        orderItem,
        shippingInfo,
        itemsPrice,
        taxPrice,
        shippingPrice,
        totalPrice,
        paymentInfo

    } = req.body

    const order = await Order.create({
        orderItem,
        shippingInfo,
        itemsPrice,
        taxPrice,
        shippingPrice,
        totalPrice,
        paymentInfo,
        paidAt: Date.now(),
        user: req.user._id

    })
    res.status(200).json({
        success: true,
        order
    })
})

//Get a single order => /api/v1/order/:id
exports.getSingleOrder = catchAsyncErrors(async (req, res, next) => {
    const order = await Order.findById(req.body.params);

    if (!order) {
        return (next(new ErrorHandler("No order was find", 404)))
    }

    res.status(200).json({
        success: true,
        order
    })
})



//Get the logged-in users orders=> /api/v1/orders/me
exports.myOrders = catchAsyncErrors(async (req, res, next) => {
    const orders = await Order.find({ user: req.user.id });

    if (!order) {
        return (next(new ErrorHandler("No orders were found", 404)))
    }

    res.status(200).json({
        success: true,
        orders
    })
})

//Get all order => /api/v1/admin/orders
exports.getAllOrders = catchAsyncErrors(async (req, res, next) => {

    const orders = await Order.find()

    const totalAmount = 0;

    orders.forEach(order => {
        totalAmount += order.totalPrice
    })
    res.status(200).json({
        success: true,
        totalAmount,
        orders
    })

})

//Update / Process order  => /api/v1/admin/order/:id
exports.updateOrder = catchAsyncErrors(async (req, res, next) => {

    const order = await Order.findById(req.params.id);

    if (order.orderStatus === 'Delivered') {
        return next(new ErrorHandler('You have already delivered this order', 400))
    }

    order.orderItem.forEach(async item => {
        await updateStock(item.product, item.quantity)
    })

    order.orderStatus = req.body.status
    order.deliveredAt = Date.now();

    await order.save()


    res.status(200).json({
        success: true
    })

})

async function updateStock(id, quantity) {
    const product = await Product.findById(id);
    product.stock = product.stock - quantity;

    await product.save({ validadeBeforeSave: false})
}


//Delete order => /api/v1/admin/order/:id
exports.deleteOrder = catchAsyncErrors(async (req,res,next )=>{
    const order = Order.findById(req.params.id);

    if (!order){
        return nest(new ErrorHandler(`Order id ${req.params.id} was not found`,404))
    }
    await order.remove();
    
    return res.status(200).json({
        success:true,
        msg:`Order ${req.params.id} was deleted`
    })
})