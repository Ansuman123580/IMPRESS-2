import React, { useEffect, useState } from 'react';
import './List.css';
import axios from "axios";
import { toast } from "react-toastify";

const List = ({ url }) => {
  const [list, setList] = useState([]);

  const categoryMap = {
    Salad: "Amla",
    Rolls: "Churan",
    Deserts: "Candy",
    Sandwich: "Dried Paan",
    Cake: "Supari",
    "Pure Veg": "Mukhwas",
    Pasta: "Seeds",
    Noodles: "Pickle",
    "Dried Fruits": "Dried Fruits"
  };

  const fetchList = async () => {
    try {
      const response = await axios.get(`${url}/api/food/list`);
      if (response.data.success) {
        setList(response.data.data);
      } else {
        toast.error("Error fetching list");
      }
    } catch (error) {
      toast.error("Server error");
    }
  };

  const removeFood = async (foodId) => {
    try {
      const response = await axios.post(`${url}/api/food/remove`, { id: foodId });
      if (response.data.success) {
        toast.success(response.data.message);
        fetchList();
      } else {
        toast.error("Error removing food");
      }
    } catch (error) {
      toast.error("Server error");
    }
  };

  const toggleStock = async (foodId, newStatus) => {
    try {
      const response = await axios.post(`${url}/api/food/update-stock`, {
        id: foodId,
        inStock: newStatus
      });
      if (response.data.success) {
        toast.success("Stock status updated");
        setList((prev) =>
          prev.map((item) =>
            item._id === foodId ? { ...item, inStock: newStatus } : item
          )
        );
      } else {
        toast.error("Error updating stock");
      }
    } catch (error) {
      toast.error("Server error");
    }
  };

  // ✅ Helper to get display price
  const getDisplayPrice = (item) => {
    if (item.packingSizes?.length) {
      return `₹${item.packingSizes[0].price} (${item.packingSizes[0].size})`;
    }
    return `₹${item.price || 0}`;
  };

  useEffect(() => {
    fetchList();
  }, []);

  return (
    <div className='list add flex-col'>
      <p>All Food List</p>
      <div className="list-table">
        <div className="list-table-format title">
          <b>Image</b>
          <b>Name</b>
          <b>Category</b>
          <b>Price</b>
          <b>Stock</b>
          <b>Action</b>
        </div>

        {list.map((item) => (
          <div key={item._id} className='list-table-format'>
            <img src={`${url}/images/${item.image}`} alt={item.name} />
            <p>{item.name}</p>
            <p>{categoryMap[item.category] || item.category}</p>

            {/* ✅ Price with packing sizes */}
            <p>{getDisplayPrice(item)}</p>

            {/* ✅ Stock toggle */}
            <p style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <label className="toggle-switch">
                <input
                  type="checkbox"
                  checked={item.inStock}
                  onChange={() => toggleStock(item._id, !item.inStock)}
                />
                <span className="slider round"></span>
              </label>
              <span>{item.inStock ? "In Stock" : "Out of Stock"}</span>
            </p>

            <p onClick={() => removeFood(item._id)} className='cursor'>X</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default List;
