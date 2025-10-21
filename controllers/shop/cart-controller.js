const Cart = require("../../models/Cart");
const Product = require("../../models/Product");

const formatCartItems = (cart) => {
  return cart.items.map((item) => ({
    productId: item.productId?._id,
    image: item.productId?.image,
    title: item.productId?.title,
    price: item.productId?.price,
    salePrice: item.productId?.salePrice,
    quantity: item.quantity,
  }));
};

const addToCartItem = async (req, res) => {
  try {
    const { userId, productId, quantity } = req.body;

    if (!userId || !productId || quantity <= 0) {
      return res.status(400).json({
        success: false,
        message: "Invalid request parameters",
      });
    }

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    let cart = await Cart.findOne({ userId });
    if (!cart) cart = new Cart({ userId, items: [] });

    const productIndex = cart.items.findIndex(
      (item) => item.productId.toString() === productId
    );

    if (productIndex === -1) {
      cart.items.push({ productId, quantity });
    } else {
      cart.items[productIndex].quantity += quantity;
      if (cart.items[productIndex].quantity <= 0) {
        cart.items.splice(productIndex, 1);
      }
    }

    await cart.save();
    await cart.populate({
      path: "items.productId",
      select: "image title price salePrice",
    });

    return res.status(200).json({
      success: true,
      message: "Product added to cart successfully",
      data: { ...cart._doc, items: formatCartItems(cart) },
    });
  } catch (error) {
    console.error("Error adding to cart:", error);
    return res.status(500).json({
      success: false,
      message: "Error adding to cart",
      error: error.message,
    });
  }
};

const getCartItem = async (req, res) => {
  try {
    const { userId } = req.params;
    if (!userId) {
      return res.status(400).json({
        success: false,
        message: "User ID is mandatory!",
      });
    }

    const cart = await Cart.findOne({ userId }).populate({
      path: "items.productId",
      select: "image title price salePrice",
    });

    if (!cart) {
      return res.status(404).json({
        success: false,
        message: "Cart not found",
      });
    }

    const validItems = cart.items.filter((item) => item.productId);
    if (validItems.length !== cart.items.length) {
      cart.items = validItems;
      await cart.save();
    }

    res.status(200).json({
      success: true,
      message: "Cart fetched successfully",
      data: { ...cart._doc, items: formatCartItems(cart) },
    });
  } catch (error) {
    console.error("Error fetching cart:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching cart",
      error: error.message,
    });
  }
};

const updateCartItem = async (req, res) => {
  try {
    const { userId, productId, quantity } = req.body;
    if (!userId || !productId || quantity <= 0) {
      return res.status(400).json({
        success: false,
        message: "Invalid request parameters",
      });
    }

    const cart = await Cart.findOne({ userId });
    if (!cart) {
      return res.status(404).json({
        success: false,
        message: "Cart not found",
      });
    }

    const item = cart.items.find((item) => item.productId.toString() === productId);
    if (!item) {
      return res.status(404).json({
        success: false,
        message: "Product not found in cart",
      });
    }

    item.quantity = quantity;
    await cart.save();
    await cart.populate({
      path: "items.productId",
      select: "image title price salePrice",
    });

    res.status(200).json({
      success: true,
      message: "Cart updated successfully",
      data: { ...cart._doc, items: formatCartItems(cart) },
    });
  } catch (error) {
    console.error("Error updating cart:", error);
    res.status(500).json({
      success: false,
      message: "Error updating cart",
      error: error.message,
    });
  }
};

const removeFromCart = async (req, res) => {
  try {
    const { userId, productId } = req.body;
    if (!userId || !productId) {
      return res.status(400).json({
        success: false,
        message: "Invalid request parameters",
      });
    }

    const cart = await Cart.findOne({ userId });
    if (!cart) {
      return res.status(404).json({
        success: false,
        message: "Cart not found",
      });
    }

    cart.items = cart.items.filter((i) => i.productId.toString() !== productId);
    await cart.save();
    await cart.populate({
      path: "items.productId",
      select: "image title price salePrice",
    });

    res.status(200).json({
      success: true,
      message: "Product removed from cart successfully",
      data: { ...cart._doc, items: formatCartItems(cart) },
    });
  } catch (error) {
    console.error("Error removing from cart:", error);
    res.status(500).json({
      success: false,
      message: "Error removing from cart",
      error: error.message,
    });
  }
};

const deleteCartItem = async (req, res) => {
  try {
    const { userId } = req.body;
    if (!userId) {
      return res.status(400).json({
        success: false,
        message: "Invalid request parameters",
      });
    }

    const cart = await Cart.findOneAndDelete({ userId });
    if (!cart) {
      return res.status(404).json({
        success: false,
        message: "Cart not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Cart deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting cart:", error);
    res.status(500).json({
      success: false,
      message: "Error deleting cart",
      error: error.message,
    });
  }
};

module.exports = {
  getCartItem,
  addToCartItem,
  removeFromCart,
  updateCartItem,
  deleteCartItem,
};
