import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaBoxOpen, FaChartLine, FaMobileAlt, FaShieldAlt, FaRegCheckCircle, FaShoppingCart, FaHeart, FaArrowRight } from 'react-icons/fa';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useSite } from '../../contexts/SiteContext';
import { useAuth } from '../../contexts/AuthContext';
import { getUploadedImageUrl } from '../../utils/imageUtils';

const Home = () => {
  const { siteName } = useSite();
  const { currentUser } = useAuth();
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    document.title = siteName ? `${siteName} - Home` : 'Industrial Tools Store';
  }, [siteName]);
  
  useEffect(() => {
    // Fetch featured products
    const fetchFeaturedProducts = async () => {
      try {
        setLoading(true);
        const response = await axios.get('http://localhost:5050/api/products/public');
        // Get up to 4 products with images as featured products
        const productsWithImages = response.data.filter(product => product.imageUrl && product.quantity > 0);
        setFeaturedProducts(productsWithImages.slice(0, 4));
        setLoading(false);
      } catch (error) {
        console.error('Error fetching featured products:', error);
        setLoading(false);
      }
    };
    
    fetchFeaturedProducts();
  }, []);
  
  const addToCart = async (productId) => {
    if (!currentUser) {
      toast.info('Please sign in to add items to your cart');
      return;
    }
    
    try {
      await axios.post('http://localhost:5050/api/cart', {
        productId,
        quantity: 1
      }, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token') || sessionStorage.getItem('token')}`
        }
      });
      toast.success('Product added to cart');
    } catch (error) {
      console.error('Error adding to cart:', error);
      toast.error('Failed to add product to cart');
    }
  };
  
  const addToWishlist = async (productId) => {
    if (!currentUser) {
      toast.info('Please sign in to add items to your wishlist');
      return;
    }
    
    try {
      await axios.post('http://localhost:5050/api/wishlist', {
        productId
      }, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token') || sessionStorage.getItem('token')}`
        }
      });
      toast.success('Product added to wishlist');
    } catch (error) {
      console.error('Error adding to wishlist:', error);
      toast.error('Failed to add product to wishlist');
    }
  };
  
  // Define industrial tools categories
  const categories = [
    {
      icon: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8 text-yellow-600">
        <path strokeLinecap="round" strokeLinejoin="round" d="M11.42 15.17L17.25 21A2.652 2.652 0 0021 17.25l-5.877-5.877M11.42 15.17l2.496-3.03c.317-.384.74-.626 1.208-.766M11.42 15.17l-4.655 5.653a2.548 2.548 0 11-3.586-3.586l6.837-5.63m5.108-.233c.55-.164 1.163-.188 1.743-.14a4.5 4.5 0 004.486-6.336l-3.276 3.277a3.004 3.004 0 01-2.25-2.25l3.276-3.276a4.5 4.5 0 00-6.336 4.486c.091 1.076-.071 2.264-.904 2.95l-.102.085m-1.745 1.437L5.909 7.5H4.5L2.25 3.75l1.5-1.5L7.5 4.5v1.409l4.26 4.26m-1.745 1.437l1.745-1.437m6.615 8.206L15.75 15.75M4.867 19.125h.008v.008h-.008v-.008z" />
      </svg>,
      title: 'Power Tools',
      description: 'Professional-grade drills, saws, grinders and more for construction and industrial applications.'
    },
    {
      icon: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8 text-yellow-600">
        <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75a4.5 4.5 0 01-4.884 4.484c-1.076-.091-2.264.071-2.95.904l-7.152 8.684a2.548 2.548 0 11-3.586-3.586l8.684-7.152c.833-.686.995-1.874.904-2.95a4.5 4.5 0 016.336-4.486l-3.276 3.276a3.004 3.004 0 002.25 2.25l3.276-3.276c.256.565.398 1.192.398 1.852z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M4.867 19.125h.008v.008h-.008v-.008z" />
      </svg>,
      title: 'Hand Tools',
      description: 'Wrenches, pliers, hammers, and screwdrivers built for durability and precision.'
    },
    {
      icon: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8 text-yellow-600">
        <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5m6 4.125l2.25 2.25m0 0l2.25 2.25M12 13.875l2.25-2.25M12 13.875l-2.25-2.25M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z" />
      </svg>,
      title: 'Tool Storage',
      description: 'Heavy-duty tool boxes, chests, and cabinets to organize and protect your equipment.'
    },
    {
      icon: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8 text-yellow-600">
        <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 00-3.213-9.193 2.056 2.056 0 00-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 00-10.026 0 1.106 1.106 0 00-.987 1.106v7.635m12-6.677v6.677m0 4.5v-4.5m0 0h-12" />
      </svg>,
      title: 'Material Handling',
      description: 'Lifting equipment, carts, conveyors, and other solutions for moving heavy materials.'
    }
  ];
  
  // Testimonials section removed

  return (
    <div className="bg-white">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-r from-gray-900 to-gray-800 overflow-hidden">
        {/* Pattern background */}
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: "url('data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M11 18c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm48 25c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm-43-7c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm63 31c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM34 90c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm56-76c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM12 86c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm28-65c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm23-11c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-6 60c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm29 22c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zM32 63c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm57-13c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-9-21c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM60 91c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM35 41c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM12 60c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2z' fill='%23ffffff' fill-opacity='1' fill-rule='evenodd'/%3E%3C/svg%3E')" }}></div>
        
        <div className="max-w-7xl mx-auto">
          <div className="relative z-10 pb-8 sm:pb-16 md:pb-20 lg:max-w-2xl lg:w-full lg:pb-28 xl:pb-32">
            <svg
              className="hidden lg:block absolute right-0 inset-y-0 h-full w-48 text-gray-800 transform translate-x-1/2"
              fill="currentColor"
              viewBox="0 0 100 100"
              preserveAspectRatio="none"
              aria-hidden="true"
            >
              <polygon points="50,0 100,0 50,100 0,100" />
            </svg>

            <div className="pt-10 sm:pt-16 lg:pt-8 xl:pt-16">
              <div className="sm:text-center lg:text-left px-4 sm:px-8 xl:pr-16">
                <div className="inline-block px-3 py-1 rounded-full bg-yellow-100 text-yellow-800 text-sm font-semibold mb-4">
                  Professional Quality Tools
                </div>
                <h1 className="text-4xl tracking-tight font-extrabold text-white sm:text-5xl md:text-6xl">
                  <span className="block">Industrial Tools</span>
                  <span className="block text-yellow-500">For Professionals</span>
                </h1>
                <p className="mt-3 text-base text-gray-300 sm:mt-5 sm:text-lg sm:max-w-xl sm:mx-auto md:mt-5 md:text-xl lg:mx-0">
                  Premium-quality industrial tools designed for reliability and performance. From power tools to specialized equipment, we provide solutions for all your professional needs.
                </p>
                <div className="mt-5 sm:mt-8 sm:flex sm:justify-center lg:justify-start">
                  <div className="rounded-md shadow">
                    <Link
                      to="/products"
                      className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-gray-900 bg-yellow-500 hover:bg-yellow-400 md:py-4 md:text-lg md:px-10"
                    >
                      Shop Now
                    </Link>
                  </div>
                  <div className="mt-3 sm:mt-0 sm:ml-3">
                    <Link
                      to="/register"
                      className="w-full flex items-center justify-center px-8 py-3 border border-gray-700 text-base font-medium rounded-md text-white bg-transparent hover:bg-gray-700 md:py-4 md:text-lg md:px-10"
                    >
                      Create Account
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="hidden lg:block lg:absolute lg:inset-y-0 lg:right-0 lg:w-1/2">
          <img
            className="h-full w-full object-cover object-center"
            src="https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80"
            alt="Industrial tools workshop"
          />
        </div>
      </div>
      {/* Featured Products Section */}
      <div className="py-20 bg-gradient-to-b from-white to-gray-50 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="inline-block px-3 py-1 rounded-full bg-yellow-100 text-yellow-800 text-sm font-semibold mb-4">
              Top Quality Selection
            </div>
            <h2 className="text-4xl font-extrabold tracking-tight text-gray-900 sm:text-5xl md:text-6xl">
              <span className="block">Discover Our</span>
              <span className="block text-yellow-500">Featured Products</span>
            </h2>
            <p className="max-w-2xl mt-5 mx-auto text-xl text-gray-500">
              Handpicked premium items with exceptional quality, competitive pricing, and fast shipping.
            </p>
          </div>

          <div className="mt-12">
            {loading ? (
              <div className="flex justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-yellow-500"></div>
              </div>
            ) : featuredProducts.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                {featuredProducts.map((product) => (
                  <div key={product.id} className="group relative bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
                    {/* Discount badge - Only show for some products to create visual interest */}
                    {product.id % 2 === 0 && (
                      <div className="absolute top-0 left-0 z-10 bg-red-500 text-white text-xs font-bold uppercase px-3 py-1 rounded-br-lg shadow-sm">
                        Sale
                      </div>
                    )}
                    
                    {/* Product image with hover effect */}
                    <Link to={`/products/${product.id}`} className="block overflow-hidden">
                      <div className="relative h-64 w-full overflow-hidden bg-gray-200 group-hover:opacity-90 transition-opacity">
                        {product.imageUrl ? (
                          <img
                            src={getUploadedImageUrl(product.imageUrl)}
                            alt={product.name}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                        ) : (
                          <div className="flex items-center justify-center h-full text-gray-500">
                            <span>No image available</span>
                          </div>
                        )}
                        <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-10 transition-opacity"></div>
                      </div>
                    </Link>
                    
                    {/* Quick action buttons that appear on hover */}
                    <div className="absolute top-2 right-2 flex flex-col space-y-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <button
                        onClick={() => addToWishlist(product.id)}
                        className="p-2 rounded-full bg-white shadow-md text-gray-700 hover:text-red-500 hover:bg-gray-50 transition-colors"
                        title="Add to Wishlist"
                      >
                        <FaHeart className="h-4 w-4" />
                      </button>
                    </div>
                    
                    {/* Product details */}
                    <div className="p-5">
                      <Link to={`/products/${product.id}`}>
                        <h3 className="text-lg font-semibold text-gray-900 hover:text-yellow-500 transition-colors">
                          {product.name}
                        </h3>
                      </Link>
                      
                      {/* Product info */}
                      <div className="mt-2 min-h-[2.5rem]">
                        <p className="text-sm text-gray-500 line-clamp-2">
                          {product.description || 'No description available'}
                        </p>
                      </div>
                      
                      {/* Price and rating */}
                      <div className="mt-4 flex items-center justify-between">
                        <div>
                          {product.id % 3 === 0 ? (
                            <div className="flex items-center">
                              <span className="text-sm text-gray-400 line-through mr-2">
                                ${(parseFloat(product.price) * 1.2).toFixed(2)}
                              </span>
                              <span className="text-lg font-bold text-yellow-600">
                                ${parseFloat(product.price).toFixed(2)}
                              </span>
                            </div>
                          ) : (
                            <span className="text-lg font-bold text-gray-900">
                              ${parseFloat(product.price).toFixed(2)}
                            </span>
                          )}
                        </div>
                        
                        {/* Star rating */}
                        <div className="flex items-center">
                          <div className="flex text-yellow-400">
                            <svg className="h-4 w-4 fill-current" viewBox="0 0 20 20">
                              <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z"/>
                            </svg>
                            <svg className="h-4 w-4 fill-current" viewBox="0 0 20 20">
                              <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z"/>
                            </svg>
                            <svg className="h-4 w-4 fill-current" viewBox="0 0 20 20">
                              <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z"/>
                            </svg>
                            <svg className="h-4 w-4 fill-current" viewBox="0 0 20 20">
                              <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z"/>
                            </svg>
                            <svg className="h-4 w-4 fill-current text-gray-300" viewBox="0 0 20 20">
                              <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z"/>
                            </svg>
                          </div>
                        </div>
                      </div>
                      
                      {/* Stock status */}
                      <div className="mt-2">
                        {product.quantity > 0 ? (
                          <span className="text-xs px-2 py-1 bg-green-100 text-green-800 rounded-full">
                            In Stock
                          </span>
                        ) : (
                          <span className="text-xs px-2 py-1 bg-red-100 text-red-800 rounded-full">
                            Out of Stock
                          </span>
                        )}
                      </div>
                      
                      {/* Add to cart button */}
                      <div className="mt-4">
                        <button
                          onClick={() => addToCart(product.id)}
                          disabled={product.quantity <= 0}
                          className={`w-full flex items-center justify-center px-4 py-2 border border-transparent rounded-md text-sm font-medium ${product.quantity > 0 ? 'bg-gray-900 hover:bg-gray-800 text-yellow-500 border border-yellow-500' : 'bg-gray-100 text-gray-400 cursor-not-allowed'} transition-colors duration-300`}
                        >
                          <FaShoppingCart className="mr-2 h-4 w-4" />
                          {product.quantity > 0 ? 'Add to Cart' : 'Out of Stock'}
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-gray-500">No featured products available.</p>
              </div>
            )}
            
            <div className="mt-12 text-center">
              <Link
                to="/products"
                className="inline-flex items-center px-6 py-3 border border-yellow-500 shadow-sm text-base font-medium rounded-md text-gray-900 bg-yellow-500 hover:bg-yellow-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500"
              >
                View All Products
                <FaArrowRight className="ml-2 -mr-1 h-5 w-5" />
              </Link>
            </div>
          </div>
        </div>
      </div>
      
      {/* Product Categories Section */}
      <div className="py-16 bg-white overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="inline-block px-3 py-1 rounded-full bg-yellow-100 text-yellow-800 text-sm font-semibold mb-4">
              Top Categories
            </div>
            <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
              Professional Tools For Every Job
            </h2>
            <p className="max-w-xl mt-5 mx-auto text-xl text-gray-500">
              We offer a wide range of industrial-grade tools and equipment to meet all your professional requirements.
            </p>
          </div>

          <div className="mt-16">
            <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
              {categories.map((category, index) => (
                <div key={index} className="bg-gray-50 rounded-lg p-6 hover:shadow-lg transition-shadow duration-300 transform hover:-translate-y-1 hover:scale-105 transition-transform">
                  <div className="flex items-center justify-center h-16 w-16 rounded-md bg-gray-100 mb-4">
                    {category.icon}
                  </div>
                  <h3 className="text-xl font-bold text-gray-900">{category.title}</h3>
                  <p className="mt-2 text-gray-600">{category.description}</p>
                  <Link 
                    to="/products" 
                    className="mt-4 inline-flex items-center text-yellow-600 hover:text-yellow-500 font-medium"
                  >
                    Browse {category.title}
                    <svg xmlns="http://www.w3.org/2000/svg" className="ml-1 h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                    </svg>
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="bg-gray-900">
        <div className="max-w-7xl mx-auto py-12 px-4 sm:py-16 sm:px-6 lg:px-8 lg:py-20">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-extrabold text-white sm:text-4xl">
              Trusted by businesses worldwide
            </h2>
            <p className="mt-3 text-xl text-yellow-200 sm:mt-4">
              Our stock management solution helps businesses optimize their inventory and boost efficiency.
            </p>
          </div>
          <dl className="mt-10 text-center sm:max-w-3xl sm:mx-auto sm:grid sm:grid-cols-3 sm:gap-8">
            <div className="flex flex-col">
              <dt className="order-2 mt-2 text-lg leading-6 font-medium text-yellow-200">Businesses</dt>
              <dd className="order-1 text-5xl font-extrabold text-white">1,000+</dd>
            </div>
            <div className="flex flex-col mt-10 sm:mt-0">
              <dt className="order-2 mt-2 text-lg leading-6 font-medium text-yellow-200">Products Managed</dt>
              <dd className="order-1 text-5xl font-extrabold text-white">500K+</dd>
            </div>
            <div className="flex flex-col mt-10 sm:mt-0">
              <dt className="order-2 mt-2 text-lg leading-6 font-medium text-yellow-200">Transactions</dt>
              <dd className="order-1 text-5xl font-extrabold text-white">10M+</dd>
            </div>
          </dl>
        </div>
      </div>
      
      

      {/* CTA Section */}
      <div className="relative bg-gradient-to-r from-gray-900 to-black overflow-hidden">
        {/* Decorative elements */}
        <div className="hidden lg:block lg:absolute lg:inset-y-0 lg:right-0 lg:w-1/2">
          <svg
            className="absolute right-0 h-full w-full transform translate-x-1/4"
            fill="none"
            viewBox="0 0 800 800"
          >
            <defs>
              <pattern
                id="e229dbec-10e9-49ee-8ec3-0286ca089edf"
                x="0"
                y="0"
                width="20"
                height="20"
                patternUnits="userSpaceOnUse"
              >
                <rect x="0" y="0" width="4" height="4" fill="rgba(255, 255, 255, 0.1)" />
              </pattern>
            </defs>
            <rect width="800" height="800" fill="url(#e229dbec-10e9-49ee-8ec3-0286ca089edf)" />
          </svg>
          <svg
            className="absolute left-0 bottom-0 h-full w-1/2 transform -translate-x-1/4"
            fill="none"
            viewBox="0 0 800 800"
          >
            <defs>
              <pattern
                id="e229dbec-10e9-49ee-8ec3-0286ca089edf-2"
                x="0"
                y="0"
                width="20"
                height="20"
                patternUnits="userSpaceOnUse"
              >
                <rect x="0" y="0" width="4" height="4" fill="rgba(255, 255, 255, 0.1)" />
              </pattern>
            </defs>
            <rect width="800" height="800" fill="url(#e229dbec-10e9-49ee-8ec3-0286ca089edf-2)" />
          </svg>
        </div>
        
        <div className="relative py-16 px-4 sm:py-24 sm:px-6 lg:px-8">
          <div className="max-w-6xl mx-auto">
            <div className="bg-white bg-opacity-10 backdrop-filter backdrop-blur-lg rounded-2xl shadow-xl overflow-hidden lg:grid lg:grid-cols-2 lg:gap-8">
              <div className="p-10 lg:p-12">
                <h2 className="text-3xl font-extrabold text-white sm:text-4xl">
                  <span className="block">Ready to elevate</span>
                  <span className="block">your shopping experience?</span>
                </h2>
                <p className="mt-4 text-lg text-yellow-100">
                  Join our community of happy shoppers and discover quality products at competitive prices. Create an account today to unlock special offers and personalized recommendations.  
                </p>
                <div className="mt-8 flex space-x-4">
                  <Link
                    to="/register"
                    className="inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-gray-900 bg-yellow-500 hover:bg-yellow-400 shadow-sm"
                  >
                    Create Account
                  </Link>
                  <Link
                    to="/products"
                    className="inline-flex items-center justify-center px-5 py-3 border border-yellow-500 text-base font-medium rounded-md text-yellow-500 hover:bg-gray-800 hover:bg-opacity-20"
                  >
                    Explore Products
                  </Link>
                </div>
              </div>
              <div className="pl-10 pr-12 pb-12 lg:p-12 lg:flex lg:flex-col lg:justify-center relative">
                <div className="absolute inset-0 flex items-center justify-center">
                  <img
                    className="lg:h-full lg:w-full object-cover object-center opacity-20"
                    src="https://images.unsplash.com/photo-1579113800032-c38bd7635818?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=987&q=80"
                    alt=""
                  />
                </div>
                <div className="relative mt-6 sm:mt-8 lg:mt-0">
                  <div className="flex flex-col items-center">
                    <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
                      <div className="flex items-center mb-4">
                        <div className="bg-yellow-500 rounded-full p-2 mr-3">
                          <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                          </svg>
                        </div>
                        <h3 className="text-lg font-medium text-gray-900">Free shipping on orders over $50</h3>
                      </div>
                      <div className="flex items-center mb-4">
                        <div className="bg-yellow-500 rounded-full p-2 mr-3">
                          <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                          </svg>
                        </div>
                        <h3 className="text-lg font-medium text-gray-900">30-day money-back guarantee</h3>
                      </div>
                      <div className="flex items-center">
                        <div className="bg-yellow-500 rounded-full p-2 mr-3">
                          <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                          </svg>
                        </div>
                        <h3 className="text-lg font-medium text-gray-900">Secure checkout process</h3>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Why Choose Us */}
      <div className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-base font-semibold text-yellow-600 tracking-wide uppercase">Why Choose Us</h2>
            <p className="mt-1 text-3xl font-extrabold text-gray-900 sm:text-4xl sm:tracking-tight">
              The smart choice for your business
            </p>
          </div>
          <div className="mt-12">
            <ul className="space-y-10 md:grid md:grid-cols-2 md:gap-x-8 md:gap-y-10 md:space-y-0">
              {[
                'Easy to use interface with minimal training required',
                'Comprehensive reporting and analytics',
                'Secure cloud-based solution with regular backups',
                'Flexible plans to grow with your business',
                'Mobile-friendly design works on all devices',
                'Regular updates with new features'
              ].map((feature, index) => (
                <li key={index} className="flex">
                  <div className="flex-shrink-0">
                    <div className="flex items-center justify-center h-12 w-12 rounded-md bg-yellow-500 text-gray-900">
                      <FaRegCheckCircle className="h-6 w-6" />
                    </div>
                  </div>
                  <div className="ml-4">
                    <p className="text-lg font-medium text-gray-900">{feature}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
