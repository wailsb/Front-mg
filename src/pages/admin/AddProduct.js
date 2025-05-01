import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { FaSave, FaImage, FaArrowLeft, FaTimes } from 'react-icons/fa';
import { toast } from 'react-toastify';
import { productsAPI, categoriesAPI } from '../../utils/api';

const AddProduct = () => {
  const { id } = useParams(); // If id exists, we're editing an existing product
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(id ? true : false);
  const [categories, setCategories] = useState([]);
  const [imagePreview, setImagePreview] = useState(null);

  // Validation schema
  const ProductSchema = Yup.object().shape({
    name: Yup.string()
      .min(2, 'Name is too short')
      .max(100, 'Name is too long')
      .required('Product name is required'),
    description: Yup.string()
      .min(10, 'Description is too short')
      .max(1000, 'Description is too long')
      .required('Description is required'),
    categoryId: Yup.number()
      .required('Category is required'),
    price: Yup.number()
      .positive('Price must be positive')
      .required('Price is required'),
    quantity: Yup.number()
      .integer('Quantity must be a whole number')
      .min(0, 'Quantity cannot be negative')
      .required('Quantity is required')
  });

  useEffect(() => {
    // Fetch categories
    const fetchCategories = async () => {
      try {
        const response = await categoriesAPI.getAll();
        // Store the full category objects to access id and name
        setCategories(response.data);
      } catch (error) {
        console.error('Error fetching categories:', error);
        toast.error('Failed to load categories');
      }
    };

    // Fetch product if editing
    const fetchProduct = async () => {
      if (id) {
        try {
          const response = await productsAPI.getById(id);
          const productData = response.data;
          
          setProduct(productData);
          // Set image preview if product has an image
          if (productData.imageUrl) {
            // If the image URL is relative, prepend the server URL
            const baseUrl = process.env.REACT_APP_API_URL || 'http://localhost:5050/api';
            const serverUrl = baseUrl.replace(/\/api$/, ''); // Remove /api if present
            const imageUrl = productData.imageUrl.startsWith('http') 
              ? productData.imageUrl 
              : `${serverUrl}${productData.imageUrl}`;
            setImagePreview(imageUrl);
          }
          setLoading(false);
        } catch (error) {
          console.error('Error fetching product:', error);
          toast.error('Failed to load product data');
          setLoading(false);
        }
      }
    };

    fetchCategories();
    fetchProduct();
  }, [id]);

  // Handle file selection
  const handleImageChange = (event, setFieldValue) => {
    const file = event.currentTarget.files[0];
    
    if (file) {
      setFieldValue('image', file);
      
      // Create image preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // Clear image preview and field
  const clearImage = (setFieldValue) => {
    setImagePreview(null);
    setFieldValue('image', null);
  };

  // Handle form submission
  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      console.log('Submitting product form:', { ...values, image: values.image ? values.image.name : 'No image' });

      // Always use FormData for consistency in both create and update operations
      const formData = new FormData();
      formData.append('name', values.name);
      formData.append('description', values.description);
      formData.append('categoryId', values.categoryId);
      formData.append('price', values.price);
      formData.append('quantity', values.quantity);
      
      // Only append image if a new one was selected
      if (values.image) {
        console.log('Appending image to form:', values.image.name, values.image.size, 'bytes');
        formData.append('image', values.image);
      }
      
      let response;
      if (id) {
        console.log('Updating existing product ID:', id);
        // Always use updateWithImage for update operations - the backend will handle cases with or without new images
        response = await productsAPI.updateWithImage(id, formData);
        console.log('Update response:', response.data);
      } else {
        console.log('Creating new product');
        // For new products, we must have an image (or let backend provide default)
        response = await productsAPI.createWithImage(formData);
        console.log('Create response:', response.data);
      }
      
      // Show success message
      toast.success(id ? 'Product updated successfully!' : 'Product added successfully!');
      
      // Redirect back to products list
      navigate('/admin/products');
    } catch (error) {
      console.error('Error saving product:', error);
      toast.error(error.response?.data?.message || 'Failed to save product');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center mb-8">
        <button
          onClick={() => navigate('/admin/products')}
          className="mr-4 p-2 rounded-md hover:bg-gray-100"
        >
          <FaArrowLeft className="text-gray-600" />
        </button>
        <h1 className="text-2xl font-bold text-gray-900">
          {id ? 'Edit Product' : 'Add New Product'}
        </h1>
      </div>
      
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <Formik
          initialValues={{
            name: product?.name || '',
            description: product?.description || '',
            categoryId: product?.categoryId || '',
            price: product?.price || '',
            quantity: product?.quantity || '',
            image: null
          }}
          validationSchema={ProductSchema}
          onSubmit={handleSubmit}
        >
          {({ isSubmitting, setFieldValue, values }) => (
            <Form className="p-6">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-6">
                  {/* Product Name */}
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                      Product Name
                    </label>
                    <Field
                      type="text"
                      name="name"
                      id="name"
                      className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-gray-900 focus:border-gray-900 sm:text-sm"
                      placeholder="Enter product name"
                    />
                    <ErrorMessage name="name" component="div" className="mt-1 text-sm text-red-600" />
                  </div>
                  
                  {/* Description */}
                  <div>
                    <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                      Description
                    </label>
                    <Field
                      as="textarea"
                      name="description"
                      id="description"
                      rows={4}
                      className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-gray-900 focus:border-gray-900 sm:text-sm"
                      placeholder="Enter product description"
                    />
                    <ErrorMessage name="description" component="div" className="mt-1 text-sm text-red-600" />
                  </div>
                  
                  {/* Category */}
                  <div>
                    <label htmlFor="categoryId" className="block text-sm font-medium text-gray-700 mb-1">
                      Category
                    </label>
                    <Field
                      as="select"
                      name="categoryId"
                      id="categoryId"
                      className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-gray-900 focus:border-gray-900 sm:text-sm"
                    >
                      <option value="">Select a category</option>
                      {categories.map((category) => (
                        <option key={category.id} value={category.id}>{category.name}</option>
                      ))}
                    </Field>
                    <ErrorMessage name="categoryId" component="div" className="mt-1 text-sm text-red-600" />
                  </div>
                  
                  {/* Price and Quantity */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-1">
                        Price ($)
                      </label>
                      <Field
                        type="number"
                        name="price"
                        id="price"
                        step="0.01"
                        min="0"
                        className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-gray-900 focus:border-gray-900 sm:text-sm"
                        placeholder="0.00"
                      />
                      <ErrorMessage name="price" component="div" className="mt-1 text-sm text-red-600" />
                    </div>
                    
                    <div>
                      <label htmlFor="quantity" className="block text-sm font-medium text-gray-700 mb-1">
                        Quantity
                      </label>
                      <Field
                        type="number"
                        name="quantity"
                        id="quantity"
                        min="0"
                        className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-gray-900 focus:border-gray-900 sm:text-sm"
                        placeholder="0"
                      />
                      <ErrorMessage name="quantity" component="div" className="mt-1 text-sm text-red-600" />
                    </div>
                  </div>
                </div>
                
                {/* Image Upload */}
                <div className="lg:col-span-1">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Product Image
                  </label>
                  <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md h-64">
                    {imagePreview ? (
                      <div className="relative w-full h-full">
                        <img 
                          src={imagePreview} 
                          alt="Product preview" 
                          className="h-full mx-auto object-contain"
                        />
                        <button
                          type="button"
                          onClick={() => clearImage(setFieldValue)}
                          className="absolute top-0 right-0 p-1 rounded-full bg-red-600 text-white"
                        >
                          <FaTimes className="h-4 w-4" />
                        </button>
                      </div>
                    ) : (
                      <div className="space-y-1 text-center flex flex-col items-center justify-center">
                        <FaImage className="h-12 w-12 text-gray-400" />
                        <div className="flex text-sm text-gray-600">
                          <label htmlFor="image" className="relative cursor-pointer bg-white rounded-md font-medium text-indigo-600 hover:text-indigo-500 focus-within:outline-none">
                            <span>Upload an image</span>
                            <input
                              id="image"
                              name="image"
                              type="file"
                              className="sr-only"
                              accept="image/*"
                              onChange={(event) => handleImageChange(event, setFieldValue)}
                            />
                          </label>
                        </div>
                        <p className="text-xs text-gray-500">
                          PNG, JPG, GIF up to 5MB
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
              
              {/* Submit Button */}
              <div className="mt-8 flex justify-end">
                <button
                  type="button"
                  onClick={() => navigate('/admin/products')}
                  className="mr-4 inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-gray-900 hover:bg-gray-800 ${
                    isSubmitting ? 'opacity-70 cursor-not-allowed' : ''
                  }`}
                >
                  <FaSave className="mr-2 -ml-1 h-5 w-5" />
                  {isSubmitting ? 'Saving...' : 'Save Product'}
                </button>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
};

export default AddProduct;
