const express = require('express');

const userController = require('../controllers/userController');
const authController = require('../controllers/authController');

const router = express.Router();

router.post('/signup', authController.signUp);
router.post('/login', authController.login);
router.post('/forgotpassword', authController.forgotPassword);
router.patch('/resetpassword/:token', authController.resetPassword);

//ADDING PROTECT MIDDLEWARE TO ALL ROUTES BELOW
router.use(authController.protect);

router.patch(
  '/updateMyPassword',
  authController.protect,
  authController.updetePassword
);
router.patch('/updateMe', authController.protect, userController.UpdateMe);
router.delete('/deleteMe', authController.protect, userController.DeleteMe);
router.get(
  '/me',
  authController.protect,
  userController.getMe,
  userController.getUser
);

//ADDING RESTRICT MIDDLEWARE TO ALL ROUTES BELOW

router.use(authController.restrictTo('admin'));
router
  .route('/')
  .get(userController.getAllUsers)
  .post(userController.createUser);
router
  .route('/:id')
  .get(userController.getUser)
  .patch(userController.updateUser)
  .delete(userController.delateUser);

module.exports = router;
