import React, { useContext, useEffect, useState, useMemo } from 'react';
import './FoodDisplay.css';
import { StoreContext } from '../Context/StoreContext';
import FoodItem from '../FoodItem/FoodItem';

// Helper: Get N random unique items from array
const getRandomItems = (array, count) => {
  if (!Array.isArray(array) || array.length === 0) return [];
  const shuffled = [...array].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, Math.min(count, array.length));
};

// List of valid categories (same as in Add.jsx)
const validCategories = [
  "Amla",
  "Churan",
  "Candy",
  "Dried Paan",
  "Supari",
  "Mukhwas",
  "Seeds",
  "Pickle",
  "Dried Fruits"
];

const FoodDisplay = ({ category }) => {
  const { food_list } = useContext(StoreContext);
  const [fixedRandomItems, setFixedRandomItems] = useState([]);

  // Normalise category for comparison
  const normalise = (str) =>
    str?.toString().trim().toLowerCase() || "";

  // Generate random items only once when "All" is selected
  useEffect(() => {
    if (category === "All" && food_list?.length > 0) {
      setFixedRandomItems(getRandomItems(food_list, 8));
    }
  }, [category, food_list]);

  // Decide which items to display
  const displayList = useMemo(() => {
    if (!food_list || food_list.length === 0) return [];

    if (category === "All") {
      return fixedRandomItems;
    }

    if (validCategories.some(cat => normalise(cat) === normalise(category))) {
      return food_list.filter(
        (item) => normalise(item.category) === normalise(category)
      );
    }

    return [];
  }, [category, food_list, fixedRandomItems]);

  // If no items to show
  if (!displayList || displayList.length === 0) {
    return (
      <div className='food-display'>
        <h2>{category === "All" ? "Best Seller" : category}</h2>
        <p>No food items available.</p>
      </div>
    );
  }

  return (
    <div className='food-display' id='food-display'>
      <h2>{category === "All" ? "Best Seller" : category}</h2>
      <div className="food-display-list">
        {displayList.map((item) => (
          <FoodItem
            key={item._id}
            id={item._id}
            name={item.name}
            description={item.description}
            price={item.price}
            image={item.image}
            inStock={item.inStock}
            packingSizes={item.packingSizes}
          />
        ))}
      </div>
    </div>
  );
};

export default FoodDisplay;
