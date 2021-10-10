const express = require('express');
const router = express.Router();
const User = require('../models/User');

//const {registerUser} = require('../controllers/authController');
const {
    registerUser,
    loginUser,
    logout,
    forgotPassword,
    resetPassword,
    getUserProfile,
    updatePassword,
    updateProfile,
    allUsers,
    getUserDetails,
    updateUser,
    deleteUser

    } = require('../controllers/authController');

const {isAuthenticatedUser, authorizeRole } = require('../middlewares/auth');

router.route('/register').post(registerUser);
router.route('/login').post(loginUser);
router.route('/logout').get(logout);
router.route('/password/forgot').post(forgotPassword);
router.route('/password/reset/:token').put(resetPassword);
router.route('/me').get(isAuthenticatedUser, getUserProfile);
router.route('/password/update').put(isAuthenticatedUser, updatePassword);
router.route('/me/update').put(isAuthenticatedUser, updateProfile);
router.route('/admin/users').get(isAuthenticatedUser,authorizeRole('admin'),allUsers);
router.route('/admin/user/:id').get(isAuthenticatedUser,authorizeRole('admin'),getUserDetails);
router.route('/admin/user/:id').put(isAuthenticatedUser,authorizeRole('admin'),updateUser);
router.route('/admin/user/:id').delete(isAuthenticatedUser,authorizeRole('admin'),deleteUser);

module.exports = router;