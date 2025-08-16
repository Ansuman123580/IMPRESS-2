import React, { useContext, useMemo } from "react";
import "./Cart.css";
import { StoreContext } from "../../components/Context/StoreContext";
import { useNavigate } from "react-router-dom";

const Cart = () => {
  const { cartItems, food_list, removeFromCart, addToCart, getTotalCartAmount, getPriceFor } =
    useContext(StoreContext);
  const navigate = useNavigate();

  // Prepare cart rows
  const rows = useMemo(() => {
    return Object.entries(cartItems)
      .filter(([_, qty]) => qty > 0)
      .map(([key, qty]) => {
        const [id, size] = key.split("|");
        const food = food_list.find((f) => String(f._id) === String(id));
        if (!food) return null;

        const unitPrice = getPriceFor(food, size);
        return {
          key,
          id,
          size,
          qty,
          food,
          unitPrice,
          subtotal: unitPrice * qty,
        };
      })
      .filter(Boolean);
  }, [cartItems, food_list, getPriceFor]);

  const subtotal = getTotalCartAmount();
  const deliveryFee = rows.length > 0 ? 2 : 0;
  const total = subtotal + deliveryFee;

  return (
    <div className="cart">
      {/* Cart Table */}
      <div className="cart-items">
        <div className="cart-items-title">
          <p>Image</p>
          <p>Item</p>
          <p>Size</p>
          <p>Price</p>
          <p>Quantity</p>
          <p>Total</p>
          <p>Remove</p>
        </div>
        <hr />

        {rows.length === 0 ? (
          <p className="cart-empty">Your cart is empty 🛒</p>
        ) : (
          rows.map(({ key, id, size, qty, food, unitPrice, subtotal }) => (
            <div key={key} className="cart-items-item">
              <img
                src={`https://impress-2-backend.onrender.com/uploads/${food.image}`}
                alt={food.name}
                onError={(e) => (e.target.src = "/placeholder.png")}
              />
              <p>{food.name}</p>
              <p>{size || "-"}</p>
              <p>₹{unitPrice}</p>

              <div className="cart-qty-controls">
                <button onClick={() => removeFromCart(id, size)}>-</button>
                <span>{qty}</span>
                <button onClick={() => addToCart(id, size)}>+</button>
              </div>

              <p>₹{subtotal}</p>
              <button
                className="cart-remove-btn"
                onClick={() => removeFromCart(id, size)}
              >
                ✕
              </button>
            </div>
          ))
        )}
        <hr />
      </div>

      {/* Cart Summary */}
      <div className="cart-bottom">
        <div className="cart-total">
          <h2>Cart Totals</h2>
          <div className="cart-total-details">
            <p>Subtotal</p>
            <p>₹{subtotal}</p>
          </div>
          <div className="cart-total-details">
            <p>Delivery Fee</p>
            <p>₹{deliveryFee}</p>
          </div>
          <div className="cart-total-details total-bold">
            <p>Total</p>
            <p>₹{total}</p>
          </div>

          <button
            className="checkout-btn"
            onClick={() => navigate("/order")}
            disabled={rows.length === 0}
          >
            PROCEED TO CHECKOUT
          </button>
        </div>

        {/* Promo Code */}
        <div className="cart-promocode">
          <p>If you have a promo code, enter it here:</p>
          <div className="cart-promocode-input">
            <input type="text" placeholder="Promo code" />
            <button>Apply</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
