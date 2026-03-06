const express = require('express');
const router = express.Router();
const orderController = require('../controllers/order.controller');

// Create a new order (Obligatory)
router.post('/order', orderController.create);

// List all orders (Optional - placed before matching :orderId to avoid treating 'list' as an id)
router.get('/order/list', orderController.list);

// Get order by id (Obligatory)
router.get('/order/:orderId', orderController.getById);

// Update order (Optional)
router.put('/order/:orderId', orderController.update);

// Delete order (Optional)
router.delete('/order/:orderId', orderController.delete);

module.exports = router;
