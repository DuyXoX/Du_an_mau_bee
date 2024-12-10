const express = require('express');
const productProductTypeRouter = express.Router();
const { getproduct, postproduct, putproduct, deleteproduct, deleteproducts, searchProducts, getProductById } = require('../controllers/productController');
const upload = require('../config/multerConfig');

productProductTypeRouter.get('/sanpham', async (req, res) => {
    return await getproduct(req, res);
});

productProductTypeRouter.get('/sanpham/:id', async (req, res) => {
    return await getProductById(req, res);
});

productProductTypeRouter.get('/search', async (req, res) => {
    return await searchProducts(req, res);
});


// productProductTypeRouter
// productProductTypeRouter
// productProductTypeRouter

module.exports = productProductTypeRouter;