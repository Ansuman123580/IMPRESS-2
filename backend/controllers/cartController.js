import userModel from "../models/userModel.js";

// ✅ Add item to user cart
const addToCart = async (req, res) => {
    try {
        const userId = req.user.id; // from authMiddleware
        const { itemId } = req.body;

        const user = await userModel.findById(userId);
        if (!user) {
            return res.json({ success: false, message: "User not found" });
        }

        const cartData = { ...user.cartData };

        if (cartData[itemId]) {
            cartData[itemId] += 1;
        } else {
            cartData[itemId] = 1;
        }

        user.cartData = cartData;
        await user.save();

        return res.json({ success: true, cartData: user.cartData });
    } catch (error) {
        console.error("Add to cart error:", error);
        return res.json({ success: false, message: "Error adding to cart" });
    }
};

// ✅ Remove item from user cart
const removeFromCart = async (req, res) => {
    try {
        const userId = req.user.id;
        const { itemId } = req.body;

        const user = await userModel.findById(userId);
        if (!user) {
            return res.json({ success: false, message: "User not found" });
        }

        const cartData = { ...user.cartData };

        if (cartData[itemId] > 1) {
            cartData[itemId] -= 1;
        } else {
            delete cartData[itemId]; // Remove key if count is 0
        }

        user.cartData = cartData;
        await user.save();

        return res.json({ success: true, cartData: user.cartData });
    } catch (error) {
        console.error("Remove from cart error:", error);
        return res.json({ success: false, message: "Error removing from cart" });
    }
};

// ✅ Get user cart
const getCart = async (req, res) => {
    try {
        const userId = req.user.id;
        const user = await userModel.findById(userId);
        if (!user) {
            return res.json({ success: false, message: "User not found" });
        }

        return res.json({ success: true, cartData: user.cartData || {} });
    } catch (error) {
        console.error("Get cart error:", error);
        return res.json({ success: false, message: "Error getting cart" });
    }
};

export { addToCart, removeFromCart, getCart };
