import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { FaShoppingCart, FaHeart, FaArrowLeft } from 'react-icons/fa';
import { productsAPI, cartAPI, wishlistAPI } from '../../utils/api';
import { toast } from 'react-toastify';
import { useAuth } from '../../contexts/AuthContext';

const ProductDetails = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const response = await productsAPI.getById(id);
        setProduct(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching product:', error);
        toast.error('Failed to load product details');
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  const handleQuantityChange = (e) => {
    const value = parseInt(e.target.value);
    if (value > 0 && value <= (product?.quantity || 1)) {
      setQuantity(value);
    }
  };

  const addToCart = async () => {
    if (!currentUser) {
      toast.info('Please sign in to add items to your cart');
      navigate('/login', { state: { from: `/products/${id}` } }); // Redirect with state to return after login
      return;
    }
    
    try {
      await cartAPI.update([{
        productId: product.id,
        quantity
      }]);
      toast.success('Product added to cart');
    } catch (error) {
      console.error('Error adding to cart:', error);
      toast.error('Failed to add product to cart');
    }
  };

  const addToWishlist = async () => {
    if (!currentUser) {
      toast.info('Please sign in to add items to your wishlist');
      navigate('/login', { state: { from: `/products/${id}` } }); // Redirect with state to return after login
      return;
    }
    
    try {
      await wishlistAPI.update([{
        productId: product.id
      }]);
      toast.success('Product added to wishlist');
    } catch (error) {
      console.error('Error adding to wishlist:', error);
      toast.error('Failed to add product to wishlist');
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">Product Not Found</h1>
        <p className="text-gray-600 mb-6">The product you're looking for doesn't exist or has been removed.</p>
        <Link to="/products" className="text-indigo-600 hover:text-indigo-800 flex items-center">
          <FaArrowLeft className="mr-2" /> Back to Products
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Link to="/products" className="text-indigo-600 hover:text-indigo-800 flex items-center mb-6">
        <FaArrowLeft className="mr-2" /> Back to Products
      </Link>
      
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <div className="md:flex">
          {/* Product Image */}
          <div className="md:w-1/2 p-4">
            <div className="bg-gray-100 rounded-lg h-96 flex items-center justify-center overflow-hidden">
              {product.imageUrl ? (
                <img 
                  src={product.imageUrl} 
                  alt={product.name} 
                  className="object-contain h-full w-full" 
                />
              ) : (
                <div className="text-center text-gray-500">
                  <p>No image available</p>
                </div>
              )}
            </div>
          </div>
          
          {/* Product Details */}
          <div className="md:w-1/2 p-6">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">{product.name}</h1>
            
            {product.category && (
              <div className="mb-4">
                <span className="px-2 py-1 text-xs font-medium rounded-full bg-gray-100 text-gray-800">
                  {product.category.name}
                </span>
              </div>
            )}
            
            <div className="text-2xl font-bold text-gray-900 mb-4">
              ${parseFloat(product.price).toFixed(2)}
            </div>
            
            <div className="mb-6">
              <h3 className="text-lg font-medium text-gray-900 mb-2">Description</h3>
              <p className="text-gray-600">{product.description || 'No description available'}</p>
            </div>
            
            <div className="mb-6">
              <h3 className="text-md font-medium text-gray-900 mb-2">Availability</h3>
              {product.quantity > 0 ? (
                <p className="text-green-600">{product.quantity} in stock</p>
              ) : (
                <p className="text-red-600">Out of stock</p>
              )}
            </div>
            
            {product.quantity > 0 && (
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Quantity
                </label>
                <div className="flex items-center">
                  <button 
                    className="text-gray-500 focus:outline-none focus:text-gray-600 p-2 border rounded-l"
                    onClick={() => quantity > 1 && setQuantity(quantity - 1)}
                  >
                    -
                  </button>
                  <input
                    type="number"
                    className="h-10 w-16 border border-gray-300 text-center"
                    value={quantity}
                    onChange={handleQuantityChange}
                    min="1"
                    max={product.quantity}
                  />
                  <button 
                    className="text-gray-500 focus:outline-none focus:text-gray-600 p-2 border rounded-r"
                    onClick={() => quantity < product.quantity && setQuantity(quantity + 1)}
                  >
                    +
                  </button>
                </div>
              </div>
            )}
            
            <div className="flex flex-col space-y-3 sm:flex-row sm:space-y-0 sm:space-x-3">
              <button
                onClick={addToCart}
                disabled={product.quantity <= 0}
                className={`flex-1 flex items-center justify-center px-6 py-3 border border-transparent rounded-md shadow-sm text-base font-medium text-white ${
                  product.quantity > 0 ? 'bg-indigo-600 hover:bg-indigo-700' : 'bg-gray-300 cursor-not-allowed'
                }`}
              >
                <FaShoppingCart className="mr-2 -ml-1 h-5 w-5" />
                Add to Cart
              </button>
              
              <button
                onClick={addToWishlist}
                className="flex items-center justify-center px-4 py-3 border border-gray-300 rounded-md shadow-sm text-base font-medium text-gray-700 bg-white hover:bg-gray-50"
              >
                <FaHeart className="mr-2 -ml-1 h-5 w-5" />
                Save to Wishlist
              </button>
            </div>
            
            {/* Additional Product Details */}
            {product.sku && (
              <div className="mt-8 border-t border-gray-200 pt-4">
                <p className="text-sm text-gray-500">SKU: {product.sku}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
