const express = require("express");
const {
  getCartItem,
  addToCartItem,
  updateCartItem,
  deleteCartItem,
} = require("../../controllers/shop/cart-controller");

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Cart
 *   description: Cart management APIs
 */

/**
 * @swagger
 * /shop/cart/{userId}:
 *   get:
 *     summary: Get all cart items for a user
 *     tags: [Cart]
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         description: User ID to fetch the cart for
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Cart items fetched successfully
 *       404:
 *         description: Cart not found
 *       500:
 *         description: Internal server error
 */
router.get("/:userId", getCartItem);

/**
 * @swagger
 * /shop/cart/add:
 *   post:
 *     summary: Add an item to the cart
 *     tags: [Cart]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - userId
 *               - productId
 *               - quantity
 *             properties:
 *               userId:
 *                 type: string
 *                 example: "user123"
 *               productId:
 *                 type: string
 *                 example: "product123"
 *               quantity:
 *                 type: number
 *                 example: 1
 *     responses:
 *       200:
 *         description: Product added to cart successfully
 *       400:
 *         description: Invalid request parameters
 *       500:
 *         description: Internal server error
 */
router.post("/add", addToCartItem);

/**
 * @swagger
 * /shop/cart/update:
 *   put:
 *     summary: Update quantity of a cart item
 *     tags: [Cart]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - userId
 *               - productId
 *               - quantity
 *             properties:
 *               userId:
 *                 type: string
 *                 example: "user123"
 *               productId:
 *                 type: string
 *                 example: "product123"
 *               quantity:
 *                 type: number
 *                 example: 2
 *     responses:
 *       200:
 *         description: Cart item updated successfully
 *       400:
 *         description: Invalid request parameters
 *       500:
 *         description: Internal server error
 */
router.put("/update", updateCartItem);

/**
 * @swagger
 * /shop/cart/delete:
 *   delete:
 *     summary: Delete entire cart for a user
 *     tags: [Cart]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - userId
 *             properties:
 *               userId:
 *                 type: string
 *                 example: "user123"
 *     responses:
 *       200:
 *         description: Cart deleted successfully
 *       404:
 *         description: Cart not found
 *       500:
 *         description: Internal server error
 */
router.delete("/delete", deleteCartItem);

module.exports = router;
