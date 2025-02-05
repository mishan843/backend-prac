const asyncHandler = require('express-async-handler')
const Product = require('../models/Product')

const createProduct = asyncHandler(async (req, res) => {
    try {
        const { productName, productImage, price, description, quality, size } = req.body;
        const userId = req.user._id; 

        const newProduct = await Product.create({
            productName,
            productImage,
            price,
            description,
            quality,
            size,
            user: userId
        });

        res.status(201).json({
            code: 201,
            success: true,
            message: "Product created successfully",
            product: newProduct
        });
    } catch (error) {
        res.status(500).json({
            status: "error",
            code: 500,
            message: "Internal Server Error",
            error: error.message
        });
    }
});


const getProducts = asyncHandler(async (req, res) => {
    try {
        let { page, limit, search } = req.query;

        page = parseInt(page) || 1;
        limit = parseInt(limit) || 10;

        const skip = (page - 1) * limit;

        let query = {};
        if (search) {
            query = {
                $or: [
                    { productName: { $regex: search, $options: "i" } }, 
                    { description: { $regex: search, $options: "i" } },
                    { quality: { $regex: search, $options: "i" } },
                    { size: { $regex: search, $options: "i" } },
                    { price: { $regex: search, $options: "i" } }
                ]
            };
        }

        const totalProducts = await Product.countDocuments(query);

        const products = await Product.find(query)
            .populate("user", "firstName lastName email")
            .skip(skip)
            .limit(limit);

        res.status(200).json({
            code: 200,
            success: true,
            message: "Products fetched successfully",
            totalProducts,
            currentPage: page,
            totalPages: Math.ceil(totalProducts / limit),
            products
        });
    } catch (error) {
        res.status(500).json({
            status: "error",
            code: 500,
            message: "Internal Server Error",
            error: error.message
        });
    }
});


const getProductById = asyncHandler(async (req, res) => {
    try {
        const { productId } = req.params;
        const product = await Product.findById(productId).populate("user", "firstName lastName email");

        if (!product) {
            return res.status(404).json({ code: 404, success: false, message: "Product not found" });
        }

        res.status(200).json({ code: 200, success: true, product });
    } catch (error) {
        res.status(500).json({
            status: "error",
            code: 500,
            message: "Internal Server Error",
            error: error.message
        });
    }
});


const updateProduct = asyncHandler(async (req, res) => {
    try {
        const { productId } = req.params;
        const userId = req.user._id; 

        const product = await Product.findById(productId);

        if (!product) {
            return res.status(404).json({ code: 404, success: false, message: "Product not found" });
        }

        if (product.user.toString() !== userId.toString()) {
            return res.status(403).json({ code: 403, success: false, message: "Unauthorized to update this product" });
        }

        const updatedProduct = await Product.findByIdAndUpdate(productId, req.body, { new: true });

        res.status(200).json({
            code: 200,
            success: true,
            message: "Product updated successfully",
            product: updatedProduct
        });
    } catch (error) {
        res.status(500).json({
            status: "error",
            code: 500,
            message: "Internal Server Error",
            error: error.message
        });
    }
});


const deleteProduct = asyncHandler(async (req, res) => {
    try {
        const { productId } = req.params;
        const userId = req.user._id; 

        const product = await Product.findById(productId);

        if (!product) {
            return res.status(404).json({ code: 404, success: false, message: "Product not found" });
        }

        if (product.user.toString() !== userId.toString()) {
            return res.status(403).json({ code: 403, success: false, message: "Unauthorized to delete this product" });
        }

        await Product.findByIdAndDelete(productId);

        res.status(200).json({ code: 200, success: true, message: "Product deleted successfully" });
    } catch (error) {
        res.status(500).json({
            status: "error",
            code: 500,
            message: "Internal Server Error",
            error: error.message
        });
    }
});

module.exports = {
    createProduct,
    getProducts,
    getProductById,
    updateProduct,
    deleteProduct
};
