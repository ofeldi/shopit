const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Order = require('../models/order');

const {
    newOrder,
    getSingleOrder,
    myOrders,
    getAllOrders,
    updateOrder,
    deleteOrder
}

    = require('../controllers/orderController');

    const { isAuthenticatedUser, authorizeRole } = require('../middlewares/auth')

router.route('/order/new').post(isAuthenticatedUser, newOrder);
router.route('/order/:id').get(isAuthenticatedUser, getSingleOrder);
router.route('/orders/me').get(isAuthenticatedUser, myOrders);
router.route('/admin/orders').get(isAuthenticatedUser,authorizeRole('admin'), getAllOrders);
router.route('/admin/orders').put(isAuthenticatedUser,authorizeRole('admin'), updateOrder);
router.route('/admin/order').delete(isAuthenticatedUser,authorizeRole('admin'), deleteOrder);

module.exports = router; 