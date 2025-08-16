import foodModel from "../models/foodModel.js";
import fs from "fs";

// ✅ Add food item
const addFood = async (req, res) => {
  try {
    const image_filename = req.file ? req.file.filename : null;
    if (!image_filename) {
      return res.json({ success: false, message: "Image file is required" });
    }

    let packingSizes = [];
    if (req.body.packingSizes) {
      try {
        packingSizes = typeof req.body.packingSizes === "string"
          ? JSON.parse(req.body.packingSizes)
          : req.body.packingSizes;
      } catch {
        return res.json({ success: false, message: "Invalid packingSizes JSON" });
      }
    }

    const food = new foodModel({
      name: req.body.name,
      description: req.body.description,
      price: Number(req.body.price) || 0,
      image: image_filename,
      category: req.body.category,
      inStock: req.body.inStock !== undefined ? req.body.inStock : true,
      packingSizes: Array.isArray(packingSizes) ? packingSizes : [],
    });

    await food.save();
    res.json({ success: true, message: "Food Added", data: food });
  } catch (error) {
    console.error(error);
    res.json({ success: false, message: "Error adding food" });
  }
};

// ✅ Get all food list
const listFood = async (req, res) => {
  try {
    const foods = await foodModel.find({});
    res.json({ success: true, data: foods });
  } catch (error) {
    console.error(error);
    res.json({ success: false, message: "Error fetching food list" });
  }
};

// ✅ Remove food item
const removeFood = async (req, res) => {
  try {
    const food = await foodModel.findById(req.body.id);

    if (!food) {
      return res.json({ success: false, message: "Food not found" });
    }

    // Delete image from uploads folder
    fs.unlink(`uploads/${food.image}`, (err) => {
      if (err) console.error("Failed to delete image:", err);
    });

    await foodModel.findByIdAndDelete(req.body.id);
    res.json({ success: true, message: "Food Removed" });
  } catch (error) {
    console.error(error);
    res.json({ success: false, message: "Error removing food" });
  }
};

// ✅ Update stock status (In Stock / Out of Stock)
const updateStock = async (req, res) => {
  try {
    const { id, inStock } = req.body;

    if (typeof inStock !== "boolean") {
      return res.json({ success: false, message: "Invalid stock status" });
    }

    const food = await foodModel.findByIdAndUpdate(id, { inStock }, { new: true });

    if (!food) {
      return res.json({ success: false, message: "Food not found" });
    }

    res.json({ success: true, message: "Stock status updated", data: food });
  } catch (error) {
    console.error(error);
    res.json({ success: false, message: "Error updating stock status" });
  }
};

export { addFood, listFood, removeFood, updateStock };
