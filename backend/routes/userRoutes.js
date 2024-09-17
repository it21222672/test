import express from 'express';
import {
  authUser,
  registerUser,
  logoutUser,
  getUserProfile,
  updateUserProfile,
  getUsers,
  deleteUser,
  getUserById,
  updateUser,
} from '../controllers/userController.js';
import { protect, admin } from '../middleware/authMiddleware.js';
import  { check, validationResult } from 'express-validator';

const router = express.Router();

router.route('/').post([
  // Name validation: must be at least 2 characters long
  check('name').isLength({ min: 2 }).withMessage('Name must be at least 2 characters long'),
  // Email validation: must be a valid email format
  check('email').isEmail().withMessage('Please provide a valid email address'),
  // Password validation: must be at least 6 characters long
  check('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
],registerUser).get(protect, admin,getUsers);

router.post('/auth',[
  check('email').isEmail().withMessage('Invalid email format'),
  check('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
], authUser);

router.post('/logout', logoutUser);

router
  .route('/profile')
  .get(protect,getUserProfile)
  .put([
    // Validation middleware for updating user profile
    check('name').optional().isLength({ min: 2 }).withMessage('Name must be at least 2 characters'),
    check('email').optional().isEmail().withMessage('Please provide a valid email address'),
    check('password').optional().isLength({ min: 6 }).withMessage('Password must be at least 6 characters long')
  ],protect,updateUserProfile);
  
router
  .route('/:id')
  .delete([
    // Validate if the id is a valid MongoDB ObjectId
    check('id')
      .custom((value) => mongoose.Types.ObjectId.isValid(value))
      .withMessage('Invalid user ID'),
  ],protect, admin,deleteUser)
  .get(protect, admin,getUserById)
  .put([
    check('id')
      .custom((value) => mongoose.Types.ObjectId.isValid(value))
      .withMessage('Invalid user ID'),
    // Name validation: optional but must be at least 2 characters
    check('name').optional().isLength({ min: 2 }).withMessage('Name must be at least 2 characters long'),
    // Email validation: must be a valid email format
    check('email').optional().isEmail().withMessage('Please provide a valid email address'),
    // isAdmin validation: must be a boolean
    check('isAdmin')
      .optional()
      .custom((value) => value === true || value === 'true')
      .withMessage('must be an Admin'),
  ],protect, admin,updateUser);

export default router;
