import React from 'react';
import { FaIndustry, FaHistory, FaHandshake, FaChartLine } from 'react-icons/fa';

const About = () => {
  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Hero Section */}
      <div className="bg-gray-900 text-white py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">About Our Industrial Supply Company</h1>
            <p className="text-lg md:text-xl mb-8 text-gray-300">
              Your trusted partner for high-quality industrial equipment and supplies since 2005.
            </p>
            <div className="inline-block bg-amber-500 text-black font-bold py-3 px-8 rounded-md">
              20+ Years of Industry Experience
            </div>
          </div>
        </div>
      </div>

      {/* Company Story */}
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold mb-10 text-center text-gray-800 border-b-4 border-amber-500 pb-3 inline-block">
            Our Story
          </h2>
          
          <div className="prose prose-lg max-w-none">
            <p className="mb-4">
              Founded in 2005, our company began as a small family-owned business with a vision to revolutionize the industrial equipment supply chain by focusing on quality, reliability, and exceptional customer service.
            </p>
            <p className="mb-4">
              What started with just 5 employees and a modest warehouse has grown into an industry leader with operations across the country, serving thousands of businesses from small workshops to large manufacturing plants.
            </p>
            <p className="mb-8">
              Today, we pride ourselves on offering an extensive catalog of industrial supplies, technical expertise, and a dedication to helping our customers find the right solutions for their operational needs.
            </p>
          </div>
        </div>
      </div>

      {/* Core Values */}
      <div className="bg-gray-900 py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-12 text-center text-white">
            Our <span className="text-amber-500">Core Values</span>
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Value 1 */}
            <div className="bg-gray-800 p-6 rounded-lg text-center">
              <div className="bg-amber-500 w-16 h-16 mx-auto rounded-full flex items-center justify-center mb-4">
                <FaIndustry className="text-gray-900 text-2xl" />
              </div>
              <h3 className="text-xl font-bold mb-3 text-white">Quality First</h3>
              <p className="text-gray-300">
                We source only the highest quality equipment that meets rigorous industry standards.
              </p>
            </div>
            
            {/* Value 2 */}
            <div className="bg-gray-800 p-6 rounded-lg text-center">
              <div className="bg-amber-500 w-16 h-16 mx-auto rounded-full flex items-center justify-center mb-4">
                <FaHandshake className="text-gray-900 text-2xl" />
              </div>
              <h3 className="text-xl font-bold mb-3 text-white">Customer Partnership</h3>
              <p className="text-gray-300">
                We build lasting relationships by understanding and addressing our customers' unique needs.
              </p>
            </div>
            
            {/* Value 3 */}
            <div className="bg-gray-800 p-6 rounded-lg text-center">
              <div className="bg-amber-500 w-16 h-16 mx-auto rounded-full flex items-center justify-center mb-4">
                <FaHistory className="text-gray-900 text-2xl" />
              </div>
              <h3 className="text-xl font-bold mb-3 text-white">Reliability</h3>
              <p className="text-gray-300">
                Our products and services are dependable, consistent and delivered on time, every time.
              </p>
            </div>
            
            {/* Value 4 */}
            <div className="bg-gray-800 p-6 rounded-lg text-center">
              <div className="bg-amber-500 w-16 h-16 mx-auto rounded-full flex items-center justify-center mb-4">
                <FaChartLine className="text-gray-900 text-2xl" />
              </div>
              <h3 className="text-xl font-bold mb-3 text-white">Innovation</h3>
              <p className="text-gray-300">
                We continuously seek better solutions and cutting-edge products to keep our customers ahead.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
