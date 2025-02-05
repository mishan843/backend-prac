const express = require('express')
const authMiddleware = require('../middlleware/authentication');
const { createProduct, updateProduct, getProductById, deleteProduct, getProducts } = require('../controllers/productCtrl');
const router = express.Router();


router.post('/create', authMiddleware, createProduct)
router.put('/update/:productId', authMiddleware, updateProduct)
router.get('/get/:productId', authMiddleware, getProductById)
router.delete('/delete/:productId', authMiddleware, deleteProduct)
router.get('/getall', authMiddleware, getProducts)



module.exports = router;