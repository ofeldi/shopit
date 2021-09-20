const express = require ('express');
const router = express.Router();

const { getProducts, newProduct,getSingleProduct,updateProduct,deleteProduct } = require ('../controllers/productController')

const { isAuthenticatedUser, authorizeRole } = require('../middlewares/auth');


router.route('/products').get(isAuthenticatedUser, authorizeRole('admin'), getProducts, );

router.route('/admin/product/new').post(isAuthenticatedUser,authorizeRole('admin'),newProduct);
router.route('/product/:id').get(getSingleProduct);
router.route('/admin/product/:id').put(updateProduct).delete(deleteProduct, authorizeRole('admin'));
    //router.route('/admin/product/:id')

module.exports = router