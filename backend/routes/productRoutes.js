import express from 'express';
const router = express.Router();
import {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  createProductReview,
  getTopProducts,
} from '../controllers/productController.js';
import { protect, admin } from '../middleware/authMiddleware.js';
import checkObjectId from '../middleware/checkObjectId.js';
import  { check, query,validationResult } from 'express-validator';

router.route('/').get([
  // Ensure pageNumber is a valid integer, optional but if provided must be an integer >= 1
  query('pageNumber')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Page number must be a positive integer'),
  // Validate keyword if provided
  query('keyword').optional().isString().withMessage('Keyword must be a string'),
],getProducts)
.post([
  check('name').notEmpty().withMessage('Product name is required'),
  check('price')
    .isFloat({ gt: 0 })
    .withMessage('Price must be a positive number'),
  check('image').notEmpty().withMessage('Image is required'),
  check('brand').notEmpty().withMessage('Brand is required'),
  check('category').notEmpty().withMessage('Category is required'),
  check('countInStock')
    .isInt({ min: 0 })
    .withMessage('Count in stock must be a non-negative integer'),
  check('description').notEmpty().withMessage('Description is required'),
],protect, admin, createProduct);

router.route('/:id/reviews').post([
  check('rating')
    .notEmpty()
    .withMessage('Rating is required')
    .isInt({ min: 1, max: 5 })
    .withMessage('Rating must be a number between 1 and 5'),
  check('comment').notEmpty().withMessage('Comment is required'),
],protect,checkObjectId, createProductReview);

router.get('/top', getTopProducts);

router
  .route('/:id')
  .get(checkObjectId, getProductById)
  .put([
    check('name').optional().notEmpty().withMessage('Product name is required'),
    check('price')
      .optional()
      .isFloat({ gt: 0 })
      .withMessage('Price must be a positive number'),
    check('description')
      .optional()
      .notEmpty()
      .withMessage('Description is required'),
    check('image').optional().notEmpty().withMessage('Image is required'),
    check('brand').optional().notEmpty().withMessage('Brand is required'),
    check('category').optional().notEmpty().withMessage('Category is required'),
    check('countInStock')
      .optional()
      .isInt({ min: 0 })
      .withMessage('Count in stock must be a non-negative integer'),
  ],protect, admin, checkObjectId, updateProduct)
  .delete(protect, admin, checkObjectId, deleteProduct);

export default router;
