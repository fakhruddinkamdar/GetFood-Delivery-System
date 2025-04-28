import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { FaPhoneAlt, FaMapMarkerAlt, FaEnvelope } from "react-icons/fa";

const Footer = () => {
  const { isAuthenticated } = useAuth();
  return (
    <footer className="bg-orange-100 text-gray-800 py-10 mt-12">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <img
                src="https://www.creativefabrica.com/wp-content/uploads/2021/03/24/Food-Delivery-Minimalist-Logo-Design-Graphics-9920848-1.jpg"
                alt="FoodExpress Logo"
                className="w-10 h-10 object-cover rounded"
              />
              <h3 className="text-2xl font-extrabold text-orange-700">Foodie Express</h3>
            </div>
            <p className="text-sm text-gray-600">
              Delivering delicious meals from your favorite restaurants right to your doorstep.
            </p>
          </div>

          <div>
            <h4 className="text-lg font-semibold text-orange-700 mb-3">Explore</h4>
            <ul className="space-y-2 text-sm text-gray-700">
              <li><Link to="/" className="hover:text-orange-600">Home</Link></li>
              <li><Link to="/products" className="hover:text-orange-600">Menu</Link></li>
          
            
              {isAuthenticated && (
                <li><Link to="/orders" className="hover:text-orange-600">My Orders</Link></li>
              )}
            </ul>
          </div>

          <div>
            <h4 className="text-lg font-semibold text-orange-700 mb-3">Support</h4>
            <ul className="space-y-2 text-sm text-gray-700">
              <li><Link to="/help" className="hover:text-orange-600">Help Center</Link></li>
              <li><Link to="/faq" className="hover:text-orange-600">FAQs</Link></li>
              <li><Link to="/contact" className="hover:text-orange-600">Contact Us</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-lg font-semibold text-orange-700 mb-3">Contact Us</h4>
            <ul className="space-y-2 text-sm text-gray-700">
              <li className="flex items-center gap-2"><FaEnvelope className="text-orange-600" /> support@foodexpress.com</li>
              <li className="flex items-center gap-2"><FaPhoneAlt className="text-orange-600" /> +91 79903 88112</li>
              <li className="flex items-center gap-2"><FaMapMarkerAlt className="text-orange-600" /> Barton Library, Bhavngar, Gujarat - 364002</li>
            </ul>
          </div>
        </div>

        <div className="border-t border-orange-200 mt-10 pt-5 text-center text-sm text-gray-500">
          <p>&copy; {new Date().getFullYear()} FoodExpress. Freshness Delivered Fast.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
