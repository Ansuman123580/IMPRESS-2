import React, { useState } from 'react';
import './Add.css';
import { assets } from '../../assets/assets';
import axios from "axios";
import { toast } from "react-toastify";

const Add = ({ url }) => {
    const [image, setImage] = useState(false);
    const [data, setData] = useState({
        name: "",
        description: "",
        category: "Amla" // default first category
    });

    // ✅ Multiple packing sizes state
    const [packingSizes, setPackingSizes] = useState([{ size: "", price: "" }]);

    const addPackingSizeRow = () => setPackingSizes(prev => [...prev, { size: "", price: "" }]);
    const removePackingSizeRow = (idx) => setPackingSizes(prev => prev.filter((_, i) => i !== idx));
    const updatePackingSize = (idx, field, value) =>
        setPackingSizes(prev => prev.map((row, i) => i === idx ? { ...row, [field]: value } : row));

    const onChangeHandler = (event) => {
        const { name, value } = event.target;
        setData((prev) => ({ ...prev, [name]: value }));
    };

    const onSubmitHandler = async (event) => {
        event.preventDefault();

        if (!image) {
            toast.error("📷 Please upload an image", { position: "top-right", theme: "colored" });
            return;
        }

        const cleanedName = data.name.trim();
        const cleanedDescription = data.description.trim();
        const cleanedCategory = data.category.trim();

        if (!cleanedName || !cleanedDescription) {
            toast.error("⚠️ Please fill all fields correctly", { position: "top-right", theme: "colored" });
            return;
        }

        const cleanedPackingSizes = packingSizes
            .filter(ps => ps.size && ps.price !== "")
            .map(ps => ({ size: ps.size, price: Number(ps.price) }));

        if (cleanedPackingSizes.length === 0) {
            toast.error("⚠️ Please add at least one packing size with price", { position: "top-right", theme: "colored" });
            return;
        }

        const formData = new FormData();
        formData.append("name", cleanedName);
        formData.append("description", cleanedDescription);
        formData.append("category", cleanedCategory);
        formData.append("packingSizes", JSON.stringify(cleanedPackingSizes));
        formData.append("image", image);

        try {
            const response = await axios.post(`${url}/api/food/add`, formData);

            if (response.data.success) {
                toast.success(`✅ ${response.data.message}`, { position: "top-right", theme: "colored" });

                setData({
                    name: "",
                    description: "",
                    category: "Amla"
                });
                setPackingSizes([{ size: "", price: "" }]);
                setImage(false);
            } else {
                toast.error(`❌ ${response.data.message || "Something went wrong"}`, { position: "top-right", theme: "colored" });
            }
        } catch (error) {
            console.error(error);
            toast.error(`⚠️ ${error.response?.data?.message || "Error adding product"}`, { position: "top-right", theme: "colored" });
        }
    };

    return (
        <div className='add'>
            <form className='flex-col' onSubmit={onSubmitHandler}>
                {/* Image Upload */}
                <div className="add-img-upload flex-col">
                    <p>Upload Image</p>
                    <label htmlFor="image">
                        <img
                            src={image ? URL.createObjectURL(image) : assets.upload_area}
                            alt="upload preview"
                        />
                    </label>
                    <input
                        onChange={(e) => setImage(e.target.files[0])}
                        type="file"
                        id="image"
                        hidden
                        required
                    />
                </div>

                {/* Product Name */}
                <div className="add-product-name flex-col">
                    <p>Product name</p>
                    <input
                        onChange={onChangeHandler}
                        value={data.name}
                        type="text"
                        name='name'
                        placeholder='Type here'
                        required
                    />
                </div>

                {/* Product Description */}
                <div className="add-product-description flex-col">
                    <p>Product description</p>
                    <textarea
                        onChange={onChangeHandler}
                        value={data.description}
                        name="description"
                        rows="6"
                        placeholder='Write Content Here'
                        required
                    ></textarea>
                </div>

                {/* Category */}
                <div className="add-category flex-col">
                    <p>Product Category</p>
                    <select
                        onChange={onChangeHandler}
                        name="category"
                        value={data.category}
                        required
                    >
                        <option value="Amla">Amla</option>
                        <option value="Churan">Churan</option>
                        <option value="Candy">Candy</option>
                        <option value="Dried Paan">Dried Paan</option>
                        <option value="Supari">Supari</option>
                        <option value="Mukhwas">Mukhwas</option>
                        <option value="Seeds">Seeds</option>
                        <option value="Pickle">Pickle</option>
                        <option value="Dried Fruits">Dried Fruits</option>
                    </select>
                </div>

                {/* Packing Sizes */}
                <div className="packing-sizes">
                    <p>Packing Sizes & Prices</p>
                    {packingSizes.map((row, idx) => (
                        <div key={idx} className="packing-size-row">
                            <input
                                type="text"
                                placeholder="Size (e.g. 100g)"
                                value={row.size}
                                onChange={(e) => updatePackingSize(idx, "size", e.target.value)}
                                required
                            />
                            <input
                                type="number"
                                placeholder="Price (₹)"
                                value={row.price}
                                onChange={(e) => updatePackingSize(idx, "price", e.target.value)}
                                required
                            />
                            {packingSizes.length > 1 && (
                                <button type="button" onClick={() => removePackingSizeRow(idx)}>❌</button>
                            )}
                        </div>
                    ))}
                    <button type="button" onClick={addPackingSizeRow}>+ Add Size</button>
                </div>

                {/* Submit Button */}
                <button type='submit' className='add-btn'>ADD</button>
            </form>
        </div>
    );
};

export default Add;
