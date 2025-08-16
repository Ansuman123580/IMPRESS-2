import { createContext, useEffect, useState } from "react";
import axios from "axios";

export const StoreContext = createContext(null);

const StoreContextProvider = (props) => {
  // cartItems: { "<foodId>|<size>": quantity }
  const [cartItems, setCartItem] = useState({});
  const [food_list, setFoodList] = useState([]);
  const [loading, setLoading] = useState(true);
  const url = "https://impress-2-backend.onrender.com";
  const [token, setToken] = useState(localStorage.getItem("token") || "");

  // Utility: composite key
  const makeKey = (id, size) => `${id}|${size || ""}`;

  // ✅ Fetch food list from backend
  const loadFoodList = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${url}/api/food/list`);
      if (res.data && res.data.success) {
        setFoodList(res.data.data || []);
      }
    } catch (err) {
      console.error("Food list error:", err?.message || err);
    } finally {
      setLoading(false);
    }
  };

  // ✅ Fetch cart for logged-in user
  const loadCart = async () => {
    if (!token) return;
    try {
      const res = await axios.get(`${url}/api/cart/get`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.data?.success && res.data.cartData) {
        setCartItem(res.data.cartData);
      }
    } catch (err) {
      console.error("Get cart error:", err?.message || err);
    }
  };

  useEffect(() => {
    loadFoodList();
  }, []);

  useEffect(() => {
    loadCart();
  }, [token]);

  // ✅ Add to cart with size support
  const addToCart = async (foodId, size) => {
    const key = makeKey(foodId, size);
    if (!token) {
      setCartItem((prev) => ({
        ...prev,
        [key]: (prev[key] || 0) + 1,
      }));
      return;
    }
    try {
      const res = await axios.post(
        `${url}/api/cart/add`,
        { itemId: key },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (res.data?.success) {
        setCartItem(res.data.cartData);
      } else {
        // fallback local update
        setCartItem((prev) => ({
          ...prev,
          [key]: (prev[key] || 0) + 1,
        }));
      }
    } catch (err) {
      console.error("Add to cart error:", err?.message || err);
      setCartItem((prev) => ({
        ...prev,
        [key]: (prev[key] || 0) + 1,
      }));
    }
  };

  // ✅ Remove from cart (size-aware)
  const removeFromCart = async (foodId, size) => {
    const key = makeKey(foodId, size);
    if (!token) {
      setCartItem((prev) => {
        const next = { ...prev };
        if (next[key] > 1) next[key] -= 1;
        else delete next[key];
        return next;
      });
      return;
    }
    try {
      const res = await axios.post(
        `${url}/api/cart/remove`,
        { itemId: key },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (res.data?.success) {
        setCartItem(res.data.cartData);
      } else {
        setCartItem((prev) => {
          const next = { ...prev };
          if (next[key] > 1) next[key] -= 1;
          else delete next[key];
          return next;
        });
      }
    } catch (err) {
      console.error("Remove from cart error:", err?.message || err);
      setCartItem((prev) => {
        const next = { ...prev };
        if (next[key] > 1) next[key] -= 1;
        else delete next[key];
        return next;
      });
    }
  };

  // ✅ Helpers to get price by size
  const getPriceFor = (food, size) => {
    if (!food) return 0;
    if (Array.isArray(food.packingSizes) && food.packingSizes.length > 0) {
      const found = food.packingSizes.find((ps) => ps.size === size);
      if (found && typeof found.price === "number") return found.price;
      if (found && typeof found.price?.$numberInt === "string") return Number(found.price.$numberInt);
      if (found && typeof found.price?.$numberDouble === "string") return Number(found.price.$numberDouble);
      // fallback to first size's price
      const first = food.packingSizes[0];
      if (typeof first?.price === "number") return first.price;
      if (typeof first?.price?.$numberInt === "string") return Number(first.price.$numberInt);
      if (typeof first?.price?.$numberDouble === "string") return Number(first.price.$numberDouble);
    }
    // fallback to base price
    if (typeof food.price === "number") return food.price;
    if (typeof food.price?.$numberInt === "string") return Number(food.price.$numberInt);
    if (typeof food.price?.$numberDouble === "string") return Number(food.price.$numberDouble);
    return 0;
  };

  // ✅ Total cart amount based on size-specific prices
  const getTotalCartAmount = () => {
    let total = 0;
    for (const key in cartItems) {
      const qty = cartItems[key];
      if (!qty) continue;
      const [id, size] = key.split("|");
      const food = food_list.find((f) => String(f._id) === String(id));
      const unit = getPriceFor(food, size);
      total += unit * qty;
    }
    return total;
  };

  const getCartCount = () => {
    return Object.values(cartItems).reduce((a, b) => a + (b || 0), 0);
  };

  const contextValue = {
    cartItems,
    setCartItem,
    food_list,
    loading,
    url,
    token,
    setToken,
    addToCart,           // (foodId, size)
    removeFromCart,      // (foodId, size)
    getTotalCartAmount,
    getCartCount,
    getPriceFor,
  };

  return (
    <StoreContext.Provider value={contextValue}>
      {props.children}
    </StoreContext.Provider>
  );
};

export default StoreContextProvider;
