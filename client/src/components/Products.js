import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { API_BASE_URL } from "../config";

const Products = () => {
  const [products, setProducts] = useState([]);
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [sortBy, setSortBy] = useState("name");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  const categories = [
    "all",
    "electronics",
    "gaming",
    "home",
    "fitness",
    "fashion",
    "audio"
  ];

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await axios.get(`${API_BASE_URL}/products`);
        // ✅ FIXED: Now res.data is directly the products array
        setProducts(res.data);
        setFilteredProducts(res.data);
      } catch (err) {
        console.log("Products fetch error:", err.response?.data || err.message);
        setProducts([]); // Set empty array on error
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  useEffect(() => {
    let filtered = products;

    if (searchTerm) {
      filtered = filtered.filter(product =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.brand.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (selectedCategory !== "all") {
      filtered = filtered.filter(product => {
        const productCategory = getProductCategory(product);
        return productCategory === selectedCategory;
      });
    }

    filtered = [...filtered].sort((a, b) => {
      switch (sortBy) {
        case "price-low":
          return a.price - b.price;
        case "price-high":
          return b.price - a.price;
        case "name":
          return a.name.localeCompare(b.name);
        default:
          return 0;
      }
    });

    setFilteredProducts(filtered);
  }, [products, searchTerm, selectedCategory, sortBy]);

  const getProductCategory = (product) => {
    const name = product.name.toLowerCase();
    
    if (name.includes("iphone") || name.includes("samsung") || name.includes("google pixel") || 
        name.includes("macbook") || name.includes("laptop") || name.includes("tablet") || 
        name.includes("watch") || name.includes("camera") || name.includes("ipad")) {
      return "electronics";
    }
    
    if (name.includes("playstation") || name.includes("xbox") || name.includes("gaming")) {
      return "gaming";
    }
    
    if (name.includes("vacuum") || name.includes("dyson") || name.includes("instant pot") || 
        name.includes("thermostat") || name.includes("echo") || name.includes("nest") || 
        name.includes("blender") || name.includes("grill")) {
      return "home";
    }
    
    if (name.includes("headphone") || name.includes("airpod") || name.includes("audio") || 
        name.includes("jbl") || name.includes("bose") || name.includes("sony wh") || 
        name.includes("soundlink")) {
      return "audio";
    }
    
    if (name.includes("fitbit") || name.includes("peloton") || name.includes("bike") || 
        name.includes("fitness") || name.includes("charge")) {
      return "fitness";
    }
    
    if (name.includes("nike") || name.includes("adidas") || name.includes("sneaker") || 
        name.includes("shoe") || name.includes("ultraboost")) {
      return "fashion";
    }
    
    return "electronics";
  };

  const toggleSelect = (id) => {
    const strId = id.toString();
    setSelectedProducts((prev) =>
      prev.includes(strId)
        ? prev.filter((pid) => pid !== strId)
        : [...prev, strId]
    );
  };

  const handleBuy = async () => {
    if (selectedProducts.length === 0) {
      alert("Please select at least one product");
      return;
    }
    
    if (!token) {
      alert("Please login first");
      navigate("/login");
      return;
    }

    try {
      await axios.post(
        `${API_BASE_URL}/cart/add`,
        { products: selectedProducts },
        { headers: { token } }
      );
      navigate("/cart");
    } catch (err) {
      console.log("Add to cart error:", err.response?.data || err.message);
      alert("Failed to add to cart: " + (err.response?.data?.message || err.message));
    }
  };

  const getCategoryIcon = (category) => {
    switch (category) {
      case "electronics": return "📱";
      case "gaming": return "🎮";
      case "home": return "🏠";
      case "fitness": return "💪";
      case "fashion": return "👟";
      case "audio": return "🎧";
      default: return "📦";
    }
  };

  const handleImageError = (e) => {
    e.target.src = "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=300&h=200&fit=crop";
    e.target.onerror = null;
  };

  if (loading) {
    return (
      <div className="products-loading">
        <div className="loading-spinner-large"></div>
        <p>Loading amazing products...</p>
      </div>
    );
  }

  return (
    <div className="products-page">
      <div className="products-header">
        <div className="header-content">
          <h1 className="page-title">🛍️ Our Products</h1>
          <p className="page-subtitle">Discover amazing products at unbeatable prices</p>
        </div>
      </div>

      <div className="products-controls">
        <div className="search-box">
          <div className="search-icon">🔍</div>
          <input
            type="text"
            placeholder="Search products or brands..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>

        <div className="filters-container">
          <div className="filter-group">
            <label>Category:</label>
            <select 
              value={selectedCategory} 
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="filter-select"
            >
              {categories.map(category => (
                <option key={category} value={category}>
                  {getCategoryIcon(category)} {category.charAt(0).toUpperCase() + category.slice(1)}
                </option>
              ))}
            </select>
          </div>

          <div className="filter-group">
            <label>Sort by:</label>
            <select 
              value={sortBy} 
              onChange={(e) => setSortBy(e.target.value)}
              className="filter-select"
            >
              <option value="name">Name A-Z</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
            </select>
          </div>
        </div>
      </div>

      <div className="products-main">
        <div className="products-stats">
          <div className="stat-card">
            <div className="stat-icon">📊</div>
            <div className="stat-info">
              <div className="stat-number">{filteredProducts.length}</div>
              <div className="stat-label">Products Found</div>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">🛒</div>
            <div className="stat-info">
              <div className="stat-number">{selectedProducts.length}</div>
              <div className="stat-label">Selected Items</div>
            </div>
          </div>
        </div>

        {filteredProducts.length === 0 ? (
          <div className="no-products">
            <div className="no-products-icon">😔</div>
            <h3>No products found</h3>
            <p>Try adjusting your search or filters</p>
          </div>
        ) : (
          <>
            <div className="products-grid-enhanced">
              {filteredProducts.map((product) => {
                const category = getProductCategory(product);
                return (
                  <div 
                    key={product._id} 
                    className={`product-card-enhanced ${selectedProducts.includes(product._id.toString()) ? 'selected' : ''}`}
                  >
                    <div className="product-badge">
                      <span className="category-icon">{getCategoryIcon(category)}</span>
                      <span className="category-name">{category}</span>
                    </div>
                    
                    <div className="product-image-container">
                      <img
                        src={product.image || "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=300&h=200&fit=crop"}
                        alt={product.name}
                        className="product-image-enhanced"
                        onError={handleImageError}
                        loading="lazy"
                      />
                      <div className="product-overlay">
                        <button 
                          className="quick-view-btn"
                          onClick={() => toggleSelect(product._id)}
                        >
                          {selectedProducts.includes(product._id.toString()) ? '✅ Selected' : '➕ Select'}
                        </button>
                      </div>
                    </div>

                    <div className="product-info">
                      <div className="brand-tag">{product.brand}</div>
                      <h3 className="product-title">{product.name}</h3>
                      <p className="product-description">{product.description}</p>
                      
                      <div className="product-meta">
                        <div className="stock-info">
                          <span className="stock-badge">
                            {product.stock > 0 ? '🟢 In Stock' : '🔴 Out of Stock'}
                          </span>
                        </div>
                        <div className="price-section">
                          <span className="product-price">₹{product.price}</span>
                          {product.originalPrice && (
                            <span className="original-price">₹{product.originalPrice}</span>
                          )}
                        </div>
                      </div>

                      <div className="product-actions">
                        <label className="select-checkbox">
                          <input
                            type="checkbox"
                            checked={selectedProducts.includes(product._id.toString())}
                            onChange={() => toggleSelect(product._id)}
                          />
                          <span className="checkmark"></span>
                          Select for Cart
                        </label>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {selectedProducts.length > 0 && (
              <div className="buy-section">
                <div className="buy-sticky">
                  <div className="selected-count">
                    <span className="count-badge">{selectedProducts.length}</span>
                    products selected
                  </div>
                  <button onClick={handleBuy} className="buy-btn-enhanced">
                    🛒 Add to Cart & Checkout
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Products;