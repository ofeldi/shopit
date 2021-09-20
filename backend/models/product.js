const mongoose = require ('mongoose');

const productSchema = new mongoose.Schema({
    name: {
        type:String,
        required:[true, 'Please enter product name'],
        trim:true,
        maxlength:[100,'Product name cannot exceed 100 chars']
    },
    price: {
        type:Number,
        require:[true, 'Please enter product price'],
        trim:true,
        maxlength:[5,'Product price is max 99999'],
        default:0.0
    },
    description: {
        type:String,
        required:[true, 'Please enter product description'],
    },
    ratings: {
        type:Number,
       default:0
    },
    images: [
        {
            public_id:{
                type:String,
                required:true
            },
            url:{
                type:String,
                required:true
            },
        }
    ],
    category:{
        type:String,
        required:[true,'Please select category for this product'],
        enum:{
            values:[
                'Electronics',
                'Cameras',
                'Laptops',
                'Accessories',
                'Headphones',
                'Food',
                'Books',
                'Clothes/Shoes',
                'Beauty/Health',
                'Sports',
                'Outdoors',
                'Home'
            ],
            message:'Please select correct category for product'
        }
    },
    seller: {
        type:String,
        required:[true, 'Please enter product seller']
    },
    stock:{
        type:Number,
        required:[true,'Please enter product stock'],
        maxLength:[5,'Product cannot exceed 5 characters'],
        default:0
    },
    numOfReviews: {
        type:Number,
        default:0
    },
    reviews:[
        {
            name:{
                type:String,
                require:true
            },
            rating:{
                type:Number,
                required:true
            },
            comment:{
                type:String,
                required:true
            }
        }
    ],
    user: {
      type: mongoose.Schema.ObjectId,
        ref:'User',
        required:true
    },
    createdAt:{
        type:Date,
        default:Date.now
    }
})

module.exports = mongoose.model('Product',productSchema)