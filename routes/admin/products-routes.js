const express = require("express");
const {
  handleImageUpload,
  addProduct,
  UpdateProduct,
  getProductById,
  getAllProduct,
  deleteProduct,
} = require("../../controllers/admin/products-controller");
const { upload } = require("../../helpers/cloudinary");

const router = express.Router();

/**
 * @swagger
 * /admin/products/addProduct:
 *   post:
 *     summary: Add a new product
 *     tags: [Products]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - image
 *               - title
 *               - description
 *               - category
 *               - brand
 *               - price
 *               - salePrice
 *               - totalStock
 *             properties:
 *               image:
 *                 type: string
 *                 example: "https://res.cloudinary.com/.../sample.jpg"
 *               title:
 *                 type: string
 *                 example: "iPhone 15"
 *               description:
 *                 type: string
 *                 example: "Latest iPhone with A17 chip"
 *               category:
 *                 type: string
 *                 example: "Mobiles"
 *               brand:
 *                 type: string
 *                 example: "Apple"
 *               price:
 *                 type: number
 *                 example: 120000
 *               salePrice:
 *                 type: number
 *                 example: 115000
 *               totalStock:
 *                 type: number
 *                 example: 50
 *     responses:
 *       201:
 *         description: Product added successfully
 *       400:
 *         description: Bad request
 *       500:
 *         description: Internal server error
 */
router.post("/addProduct", addProduct);

/**
 * @swagger
 * /admin/products/getAllProduct:
 *   get:
 *     summary: Get all products
 *     tags: [Products]
 *     responses:
 *       200:
 *         description: Products found
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *       500:
 *         description: Internal server error
 */
router.get("/getAllProduct", getAllProduct);

/**
 * @swagger
 * /admin/products/getProductById/{id}:
 *   get:
 *     summary: Get a product by ID
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Product ID
 *     responses:
 *       200:
 *         description: Product found
 *       404:
 *         description: Product not found
 *       500:
 *         description: Internal server error
 */
router.get("/getProductById/:id", getProductById);

/**
 * @swagger
 * /admin/products/updateProduct/{id}:
 *   patch:
 *     summary: Update an existing product
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Product ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               price:
 *                 type: number
 *               salePrice:
 *                 type: number
 *               totalStock:
 *                 type: number
 *     responses:
 *       200:
 *         description: Product updated successfully
 *       400:
 *         description: Bad request
 *       404:
 *         description: Product not found
 *       500:
 *         description: Internal server error
 */
router.patch("/updateProduct/:id", UpdateProduct);

/**
 * @swagger
 * /admin/products/deleteProduct/{id}:
 *   delete:
 *     summary: Delete a product by ID
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Product ID
 *     responses:
 *       200:
 *         description: Product deleted successfully
 *       404:
 *         description: Product not found
 *       500:
 *         description: Internal server error
 */
router.delete("/deleteProduct/:id", deleteProduct);

/**
 * @swagger
 * /admin/products/upload-image:
 *   post:
 *     summary: Upload a product image to Cloudinary
 *     tags: [Products]
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               my_file:
 *                 type: string
 *                 format: binary
 *                 description: The image file to upload
 *     responses:
 *       200:
 *         description: Image uploaded successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 url:
 *                   type: object
 *                   description: Cloudinary upload response
 *       400:
 *         description: Bad request (file missing or invalid)
 */
router.post("/upload-image", upload.single("my_file"), handleImageUpload);

module.exports = router;
