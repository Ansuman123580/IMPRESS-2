import React, { useContext, useMemo, useState } from 'react';
import './FoodItem.css';
import { assets } from '../../assets/assets';
import { StoreContext } from '../Context/StoreContext';

const FoodItem = ({ id, name, price, description, image, inStock, packingSizes = [] }) => {
  const { cartItems, addToCart, removeFromCart, getPriceFor } = useContext(StoreContext);
  const [selectedSize, setSelectedSize] = useState(
    packingSizes && packingSizes.length > 0 ? packingSizes[0].size : ""
  );

  const imageURL = `http://localhost:4000/uploads/${image}`;

  const displayPrice = useMemo(() => {
    const food = { _id: id, price, packingSizes };
    return getPriceFor(food, selectedSize);
  }, [id, price, packingSizes, selectedSize, getPriceFor]);

  const key = useMemo(() => `${id}|${selectedSize || ""}`, [id, selectedSize]);
  const qty = cartItems[key] || 0;

  return (
    <div className='food-item'>
      <div className="food-item-img-container">
        {!inStock && <span className="out-of-stock-badge">Out of Stock</span>}
        
        <img
          className={`food-item-img ${!inStock ? "blurred" : ""}`}
          src={imageURL}
          alt={name}
          onError={(e) => { e.currentTarget.src = assets.placeholder; }}
        />

        {/* Show add/remove controls only if in stock */}
        {inStock ? (
          qty === 0 ? (
            <img
              className='add'
              onClick={() => addToCart(id, selectedSize)}
              src={assets.add_icon_white}
              alt="Add"
            />
          ) : (
            <div className='food-item-counter'>
              <img onClick={() => removeFromCart(id, selectedSize)} src={assets.remove_icon_red} alt="-" />
              <p>{qty}</p>
              <img onClick={() => addToCart(id, selectedSize)} src={assets.add_icon_green} alt="+" />
            </div>
          )
        ) : null}
      </div>

      <div className="food-item-info">
        <div className="food-item-name-rating">
          <p>{name}</p>
          <img src={assets.rating_starts} alt="Rating" />
        </div>

        <p className="food-item-desc">{description}</p>

        {packingSizes && packingSizes.length > 0 && (
          <div className="food-item-sizes">
            {packingSizes.map((ps) => (
              <button
                key={ps.size}
                className={`size-box ${selectedSize === ps.size ? "active" : ""}`}
                onClick={() => setSelectedSize(ps.size)}
                disabled={!inStock} // disable size change if out of stock
              >
                {ps.size}
              </button>
            ))}
          </div>
        )}

        <p className="food-item-price">₹{displayPrice}</p>
      </div>
    </div>
  );
};

export default FoodItem;
