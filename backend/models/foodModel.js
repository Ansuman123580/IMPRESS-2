import mongoose from "mongoose";

const packingSizeSchema = new mongoose.Schema({
  size: { type: String, required: true },
  price: { type: Number, required: true },
}, { _id: false });

const foodSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  // Base price (fallback jab packingSizes empty ho)
  price: { type: Number, required: true },
  image: { type: String, required: true },
  category: { type: String, required: true },
  inStock: { type: Boolean, default: true },
  // ✅ NEW
  packingSizes: { type: [packingSizeSchema], default: [] },
}, { timestamps: true });

const foodModel = mongoose.models.food || mongoose.model("food", foodSchema);
export default foodModel;
