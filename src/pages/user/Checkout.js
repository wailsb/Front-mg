import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { FaArrowLeft, FaCreditCard, FaLock } from 'react-icons/fa';
import { useAuth } from '../../contexts/AuthContext';
import { toast } from 'react-toastify';

const Checkout = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [subtotal, setSubtotal] = useState(0);
  const [tax, setTax] = useState(0);
  const [total, setTotal] = useState(0);
  const [processingOrder, setProcessingOrder] = useState(false);

  useEffect(() => {
    // In a real app, we would fetch the cart from the API
    const fetchCart = async () => {
      try {
        setLoading(true);
        
        // Simulating API call with timeout
        setTimeout(() => {
          // Mock data for demonstration
          const items = [
            {
              id: 1,
              name: 'Wireless Bluetooth Headphones',
              price: 79.99,
              quantity: 1
            },
            {
              id: 2,
              name: 'USB-C Charging Cable',
              price: 24.99,
              quantity: 2
            }
          ];
          
          setCartItems(items);
          calculateTotals(items);
          setLoading(false);
        }, 500);
      } catch (error) {
        console.error('Error fetching cart:', error);
        toast.error('Failed to load cart');
        setLoading(false);
      }
    };

    fetchCart();
  }, []);

  const calculateTotals = (items) => {
    const itemSubtotal = items.reduce((acc, item) => acc + (item.price * item.quantity), 0);
    const itemTax = itemSubtotal * 0.08; // Assuming 8% tax
    const itemTotal = itemSubtotal + itemTax;
    
    setSubtotal(itemSubtotal);
    setTax(itemTax);
    setTotal(itemTotal);
  };

  // Validation schema
  const CheckoutSchema = Yup.object().shape({
    name: Yup.string()
      .min(2, 'Name is too short')
      .max(50, 'Name is too long')
      .required('Full name is required'),
    email: Yup.string()
      .email('Invalid email address')
      .required('Email is required'),
    address: Yup.string()
      .required('Address is required'),
    city: Yup.string()
      .required('City is required'),
    state: Yup.string()
      .required('State is required'),
    zipCode: Yup.string()
      .matches(/^\d{5}(-\d{4})?$/, 'Invalid ZIP code')
      .required('ZIP code is required'),
    cardName: Yup.string()
      .required('Name on card is required'),
    cardNumber: Yup.string()
      .matches(/^\d{16}$/, 'Card number must be 16 digits')
      .required('Card number is required'),
    expDate: Yup.string()
      .matches(/^(0[1-9]|1[0-2])\/\d{2}$/, 'Expiration date must be in MM/YY format')
      .required('Expiration date is required'),
    cvv: Yup.string()
      .matches(/^\d{3,4}$/, 'CVV must be 3 or 4 digits')
      .required('CVV is required')
  });

  const handleSubmit = async (values) => {
    try {
      setProcessingOrder(true);
      
      // In a real app, we would submit the order to the API
      // Simulating API call with timeout
      setTimeout(() => {
        // Order successful
        toast.success('Order placed successfully!');
        navigate('/user/orders');
      }, 1500);
    } catch (error) {
      console.error('Error placing order:', error);
      toast.error('Failed to place order');
      setProcessingOrder(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  if (cartItems.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-8">Checkout</h1>
        <div className="bg-white rounded-lg shadow-sm p-8 text-center">
          <div className="text-indigo-500 mb-4">
            <FaLock className="h-16 w-16 mx-auto opacity-30" />
          </div>
          <h2 className="text-xl font-medium text-gray-900 mb-2">Your cart is empty</h2>
          <p className="text-gray-600 mb-6">You need to add items to your cart before checkout</p>
          <Link 
            to="/user/products" 
            className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
          >
            Browse Products
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-8">Checkout</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Checkout Form */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            <Formik
              initialValues={{
                name: currentUser?.name || '',
                email: currentUser?.email || '',
                address: currentUser?.address || '',
                city: '',
                state: '',
                zipCode: '',
                cardName: '',
                cardNumber: '',
                expDate: '',
                cvv: ''
              }}
              validationSchema={CheckoutSchema}
              onSubmit={handleSubmit}
            >
              {({ isSubmitting }) => (
                <Form className="p-6">
                  <div className="mb-8">
                    <h2 className="text-lg font-medium text-gray-900 mb-4">Shipping Information</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="md:col-span-2">
                        <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                          Full Name
                        </label>
                        <Field
                          type="text"
                          name="name"
                          id="name"
                          className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                          placeholder="John Doe"
                        />
                        <ErrorMessage name="name" component="div" className="mt-1 text-sm text-red-600" />
                      </div>
                      
                      <div className="md:col-span-2">
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                          Email Address
                        </label>
                        <Field
                          type="email"
                          name="email"
                          id="email"
                          className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                          placeholder="john@example.com"
                        />
                        <ErrorMessage name="email" component="div" className="mt-1 text-sm text-red-600" />
                      </div>
                      
                      <div className="md:col-span-2">
                        <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">
                          Address
                        </label>
                        <Field
                          type="text"
                          name="address"
                          id="address"
                          className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                          placeholder="123 Main St"
                        />
                        <ErrorMessage name="address" component="div" className="mt-1 text-sm text-red-600" />
                      </div>
                      
                      <div>
                        <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-1">
                          City
                        </label>
                        <Field
                          type="text"
                          name="city"
                          id="city"
                          className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                          placeholder="New York"
                        />
                        <ErrorMessage name="city" component="div" className="mt-1 text-sm text-red-600" />
                      </div>
                      
                      <div>
                        <label htmlFor="state" className="block text-sm font-medium text-gray-700 mb-1">
                          State
                        </label>
                        <Field
                          type="text"
                          name="state"
                          id="state"
                          className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                          placeholder="NY"
                        />
                        <ErrorMessage name="state" component="div" className="mt-1 text-sm text-red-600" />
                      </div>
                      
                      <div>
                        <label htmlFor="zipCode" className="block text-sm font-medium text-gray-700 mb-1">
                          ZIP Code
                        </label>
                        <Field
                          type="text"
                          name="zipCode"
                          id="zipCode"
                          className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                          placeholder="10001"
                        />
                        <ErrorMessage name="zipCode" component="div" className="mt-1 text-sm text-red-600" />
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h2 className="text-lg font-medium text-gray-900 mb-4">Payment Information</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="md:col-span-2">
                        <label htmlFor="cardName" className="block text-sm font-medium text-gray-700 mb-1">
                          Name on Card
                        </label>
                        <Field
                          type="text"
                          name="cardName"
                          id="cardName"
                          className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                          placeholder="John Doe"
                        />
                        <ErrorMessage name="cardName" component="div" className="mt-1 text-sm text-red-600" />
                      </div>
                      
                      <div className="md:col-span-2">
                        <label htmlFor="cardNumber" className="block text-sm font-medium text-gray-700 mb-1">
                          Card Number
                        </label>
                        <Field
                          type="text"
                          name="cardNumber"
                          id="cardNumber"
                          className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                          placeholder="1234 5678 9012 3456"
                        />
                        <ErrorMessage name="cardNumber" component="div" className="mt-1 text-sm text-red-600" />
                      </div>
                      
                      <div>
                        <label htmlFor="expDate" className="block text-sm font-medium text-gray-700 mb-1">
                          Expiration Date
                        </label>
                        <Field
                          type="text"
                          name="expDate"
                          id="expDate"
                          className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                          placeholder="MM/YY"
                        />
                        <ErrorMessage name="expDate" component="div" className="mt-1 text-sm text-red-600" />
                      </div>
                      
                      <div>
                        <label htmlFor="cvv" className="block text-sm font-medium text-gray-700 mb-1">
                          CVV
                        </label>
                        <Field
                          type="text"
                          name="cvv"
                          id="cvv"
                          className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                          placeholder="123"
                        />
                        <ErrorMessage name="cvv" component="div" className="mt-1 text-sm text-red-600" />
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-6 flex items-center">
                    <Link 
                      to="/user/cart" 
                      className="inline-flex items-center text-sm text-indigo-600 hover:text-indigo-800"
                    >
                      <FaArrowLeft className="mr-2 h-4 w-4" />
                      Back to Cart
                    </Link>
                    
                    <button
                      type="submit"
                      disabled={isSubmitting || processingOrder}
                      className={`ml-auto inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 ${
                        (isSubmitting || processingOrder) ? 'opacity-70 cursor-not-allowed' : ''
                      }`}
                    >
                      <FaCreditCard className="mr-2 -ml-1 h-5 w-5" />
                      {isSubmitting || processingOrder ? 'Processing...' : 'Place Order'}
                    </button>
                  </div>
                </Form>
              )}
            </Formik>
          </div>
        </div>
        
        {/* Order Summary */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Order Summary</h2>
            
            <ul className="mb-4 divide-y divide-gray-200">
              {cartItems.map((item) => (
                <li key={item.id} className="py-3 flex justify-between items-center">
                  <div>
                    <p className="text-sm font-medium text-gray-900">{item.name}</p>
                    <p className="text-xs text-gray-500">Qty: {item.quantity}</p>
                  </div>
                  <span className="text-sm font-medium text-gray-900">
                    ${(item.price * item.quantity).toFixed(2)}
                  </span>
                </li>
              ))}
            </ul>
            
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Subtotal</span>
                <span className="text-sm text-gray-900">${subtotal.toFixed(2)}</span>
              </div>
              
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Tax (8%)</span>
                <span className="text-sm text-gray-900">${tax.toFixed(2)}</span>
              </div>
              
              <div className="border-t border-gray-200 pt-3 flex justify-between">
                <span className="text-base font-medium text-gray-900">Total</span>
                <span className="text-base font-bold text-gray-900">${total.toFixed(2)}</span>
              </div>
            </div>
            
            <div className="mt-6 flex items-center justify-center text-sm text-gray-500">
              <FaLock className="mr-2 h-4 w-4 text-indigo-500" />
              <span>Secure payment processing</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
