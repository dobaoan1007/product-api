const express = require("express");
const mongoose = require("mongoose");
require("dotenv").config();

const app = express();
const Product = require("./models/Product");

app.use(express.json());

// CREATE - Thêm sản phẩm
app.post("/products", async (req, res) => {
    try {
        const product = await Product.create(req.body);
        res.status(201).json(product);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// READ - Lấy danh sách sản phẩm
app.get("/products", async (req, res) => {
    try {
        const products = await Product.find();
        res.json(products);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// UPDATE - Sửa sản phẩm
app.put("/products/:id", async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);

        if (!product) {
            return res.status(404).json({
                message: "Product not found"
            });
        }

        product.pid = req.body.pid;
        product.pname = req.body.pname;
        product.price = req.body.price;
        product.quantity = req.body.quantity;

        await product.save();

        res.json(product);
    } catch (error) {
        res.status(400).json({
            message: error.message
        });
    }
});

// DELETE - Xóa sản phẩm
app.delete("/products/:id", async (req, res) => {
    try {
        const product = await Product.findByIdAndDelete(req.params.id);

        if (!product) {
            return res.status(404).json({
                message: "Product not found"
            });
        }

        res.json({
            message: "Product deleted successfully"
        });
    } catch (error) {
        res.status(400).json({
            message: error.message
        });
    }
});

// Trang chủ
app.get("/", (req, res) => {
    res.send("Product API is running");
});

// Trang health check
app.get("/health", (req, res) => {
    res.status(200).send("OK");
});

// Kết nối MongoDB
mongoose
    .connect(process.env.MONGO_URI)
    .then(() => {
        console.log("MongoDB connected");
    })
    .catch((err) => {
        console.log("MongoDB connection error:", err);
    });

// Chạy server
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});