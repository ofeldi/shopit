const Product = require('../models/product')


const ErrorHandler = require('../utils/errorHandler');
const catchAsyncErrors = require('../middlewares/catchAsyncErrors');
const APIFeatures = require('../utils/apiFeatures');
const _ = require('lodash');

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

//Create a new review => /api/v1/review
exports.createProductReview = catchAsyncErrors(async (req, res, next) => {

    const {rating, comment, productId} = req.body;
    const user_id = req.user[0]._id

    const review = {

        rating: Number(rating),
        comment,
        user: user_id,
        name: req.user[0].name
    }

    console.log(req.user[0])


    const product = await Product.findById(productId);

    const isReviewed = product.reviews.find(
        r => r._id.toString() === req.cookies.token.user_id.toString()
    )


    if (isReviewed) {
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
    product.ratings = product.reviews.reduce((acc, item) => item.rating + acc) / product.reviews.length;


    //const avgRev = product.reviews.forEach((totalRating, review) => review.rating + totalRating) / product.numOfReviews


    async function getAverageReview(productId) {
        let acc = 0;
        product.reviews.forEach((review) => {
            acc = acc + review.rating
        })
        return (acc / product.reviews.length)
    }

    product.ratings = await getAverageReview(product._id)

    await product.save({validateBeforeSave: false})

    return res.status(200).json({
        success: true
    })

})


//Get product review /api/v1/reviews/:id
exports.getProductReview = catchAsyncErrors(async (req, res, next) => {
    const product = await Product.findById(req.query.id)

    return (res.status(200).json({
        success: true,
        review: product.reviews.length,
        rating: product.ratings,
        reviews: product.reviews
    }))
})

//Delete product review /api/v1/reviews

exports.deletetReview = catchAsyncErrors(async (req, res, next) => {
    const product = await Product.findById(req.query.productId)
    const review = product.reviews.filter(review => review._id.toString() === req.query.id.toString());
    console.log(review[0]._id)
    if (!review[0]._id || !product) {
        return next(new ErrorHandler(`no review was found to delete`, 404))
    }

    else {
        async function getAverageReview(productId) {
            let acc = 0;
            product.reviews.forEach((review) => {
                acc = acc + review.rating
            })
            return (acc / product.reviews.length)
        }

        for (let i=0; i < product.reviews.length; i++){
            if (product.reviews[i]._id.toString() === req.query.id.toString()) {
                product.reviews.splice(i,1);
                product.ratings = await getAverageReview(product._id);
                product.numOfReviews = product.reviews.length
                await product.save({validateBeforeSave: false})
            }
        }

        /*const review = product.reviews.filter(review => review._id.toString() === req.query.id.toString());
        //console.log(review[0])


        const temp = _.remove(product.reviews, function (o) {
            return review[0].id === product.reviews
        })*/

        return (res.status(200).json({
            success: true,
            msg: `Review ${review[0].id} by the user ${review[0].name} was deleted`
        }))
    }

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