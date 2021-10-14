const Product = require('../models/product')


const ErrorHandler = require('../utils/errorHandler');
const catchAsyncErrors = require('../middlewares/catchAsyncErrors');
const APIFeatures = require('../utils/apiFeatures');


// Create new product => /api/v1/admin/product/new
exports.newProduct = catchAsyncErrors(async (req, res, next) => {


    console.log(req.cookies.token.user_id)
    req.body.user = req.cookies.token.user_id
    const product = await Product.create(req.body)
    res.status(201).json({
        success: true,
        product
    })
})


//Get all products => /api/v1/products?keyword=something

exports.getProducts = catchAsyncErrors(async (req, res, next) => {
    const resPerPage = 4;
    const productCount = await Product.countDocuments()

    const apiFeatures = new APIFeatures(Product.find(), req.query)
        .search()
        .filter()
        .pagination(resPerPage)
    const products = await apiFeatures.query;

    //console.log('someone is asking for products')
    res.status(200).json({
        success: "true",
        count: products.length,
        products: products,
        productCount
    })
})

// Get single product =>/api/v1/product/:id

exports.getSingleProduct = catchAsyncErrors(async (req, res, next) => {
    const product = await Product.findById(req.params.id);
    // console.log(product);
    if (!product) {
        return (next(new ErrorHandler('Product was not found', 404)))
    }

    res.status(200).json({
        success: true,
        product
    })

})

//Update product => /api/v1/admin/product/:id

exports.updateProduct = catchAsyncErrors(async (req, res, next) => {
    let product = await Product.findById(req.params.id);

    if (!product) {
        return (next(new ErrorHandler('Product was not found', 404)))
    }

    /* {
         return res.status(404).json({
             success: false,
             message: 'Product was not found'
         })
     }*/

    product = await Product.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true,
        useFindAndModify: false
    });

    res.status(200).json({
        success: true,
        product
    })
})


// Delete single product =>/api/v1/admin/product/:id


exports.deleteProduct = catchAsyncErrors(async (req, res, next) => {

    const product = await Product.findById(req.params.id);

    if (!product) {
        return next(new ErrorHandler('Product not found', 404));
    }
    /*
        // Deleting images associated with the product
        for (let i = 0; i < product.images.length; i++) {
            const result = await cloudinary.v2.uploader.destroy(product.images[i].public_id)
        }*/

    await product.remove();

    res.status(200).json({
        success: true,
        message: 'Product is deleted.'
    })

})

//Create a new review => /api/v1/review/new
exports.createProductReview = catchAsyncErrors(async (req, res, next) => {

    const { rating, comment, productId } = req.body;
    const user_id = req.user[0]._id
    
    const review = {

        rating: Number(rating),
        comment,
        user_id
    }

    console.log(req.user[0]._id)


    const product = await Product.findById(productId);

    const isReviewd = product.reviews.find(
        r => r.user.toString() === req.user._id.toString()
    )

    if (isReviewd) {
        product.reviews.forEach(review => {
            if (review.user.toString() === req.user._id.toString()) {
                review.comment = comment;
                review.rating = rating;
            }
        })
    } else {
        product.reviews.push(review);
        product.numOfReviews = product.reviews.length
    }
    product.rating = product.reviews.reduce((acc, item) => item.rating + acc) / product.reviews.length

    await product.save({ validateBeforeSave: false })

    return res.status(200).json({
        success: true
    })

})



/*exports.deleteProduct = async ( (req, res, next) => {
    let product = await Product.findById(req.params.id);


    console.log(product);
    if (!product) {
        return res.status(404).json({
            success: false,
            message: 'Product was not found'
        })
    }

    product = await Product.findByIdAndDelete(req.params.id,req.body, {
        success:true,
    });


    res.status(200).json({
        success:true,
        product
    })

})*/

//module.export = getProducts