const express = require("express");
const { getFilteredProducts, getProductById } = require("../../controllers/shop/products-controller");
const router = express.Router();


/**
 * @swagger
 * /shop/products/getFilteredProducts:
 *   get:
 *     summary: Get all filtered products
 *     tags: [Products]
 *     responses:
 *       200:
 *         description: Products fetched successfully
 *       500:
 *         description: Internal server error
 */
router.get("/getFilteredProducts", getFilteredProducts);

/** 
 * @swagger
 * /shop/products/getProductById/{id}:
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
 *         description: Product fetched successfully
 *       404:
 *         description: Product not found
 *       500:
 *         description: Internal server error   
 */

router.get("/getProductById/:id", getProductById);

module.exports = router