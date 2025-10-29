import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useState, useEffect } from "react";
import ProductList from "./components/ProductList";
import ProductDetail from "./components/ProductDetail";
import "./App.css"; 
import CartButton from "./components/Cart/CartButton";
import Cart from "./components/Cart/Cart";


export default function App() {
  // Cart state
  // 1) Initialize from localStorage (runs once)
  const [cartItems, setCartItems] = useState(() => {
    try {
      const saved = localStorage.getItem("cart");
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      console.error("Error parsing cart from localStorage:", e);
      return [];
    }
  });

  const [showCart, setShowCart] = useState(false);

  // 2) Persist whenever cartItems changes (no mount overwrite now)
  useEffect(() => {
    try {
      localStorage.setItem("cart", JSON.stringify(cartItems));
    } catch (e) {
      console.error("Error saving cart to localStorage:", e);
    }
  }, [cartItems]);

  // Add item to cart or update quantity if already exists
  const addToCart = (product, quantity) => {
    setCartItems((prevItems) => {
      const existingItem = prevItems.find(
        (item) => item.product.id === product.id
      );

      if (existingItem) {
        // Update quantity of existing item
        return prevItems.map((item) =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      } else {
        // Add new item
        return [...prevItems, { product, quantity }];
      }
    });
  };

  // Remove item from cart
  const removeFromCart = (productId) => {
    setCartItems((prevItems) =>
      prevItems.filter((item) => item.product.id !== productId)
    );
  };

  // Update quantity of item in cart
  const updateQuantity = (productId, newQuantity) => {
    if (newQuantity < 1) return; // Don't allow quantity less than 1

    setCartItems((prevItems) =>
      prevItems.map((item) =>
        item.product.id === productId
          ? { ...item, quantity: newQuantity }
          : item
      )
    );
  };

  // Clear entire cart
  const clearCart = () => {
    setCartItems([]);
  };

  // Calculate cart total (handles sale prices)
  const getCartTotal = () => {
    return cartItems.reduce((total, item) => {
      const price = item.product.isOnSale
        ? item.product.salePrice
        : item.product.price;
      return total + price * item.quantity;
    }, 0);
  };

  // Get total number of items in cart
  const getCartItemCount = () => {
    return cartItems.reduce((count, item) => count + item.quantity, 0);
  };

  // Rest of your component code...
  return (
  <Router>
    <div className="app">
      <header className="app-header">
        <div className="header-content">
          <div>
            <h1>Blogbox Store</h1>
            <p>Your E-Commerce Solution</p>
          </div>
          <CartButton
            itemCount={getCartItemCount()}
            total={getCartTotal()}
            onClick={() => setShowCart(true)}
          />
        </div>
      </header>

      <main className="app-main">
        <Routes>
          <Route path="/" element={<ProductList />} />
          <Route
            path="/products/:id"
            element={<ProductDetail addToCart={addToCart} />}
          />
        </Routes>
      </main>

      <footer className="app-footer">
        <p>&copy; 2024 Blogbox Store. Built with React & ASP.NET Core</p>
      </footer>

      {showCart && (
        <Cart
          items={cartItems}
          total={getCartTotal()}
          onUpdateQuantity={updateQuantity}
          onRemove={removeFromCart}
          onClear={clearCart}
          onClose={() => setShowCart(false)}
        />
      )}
    </div>
  </Router>
);

}