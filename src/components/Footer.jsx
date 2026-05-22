import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="bg-white border-t border-gray-200 mt-auto">
      <div className="max-w-7xl mx-auto px-5 py-10">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 mb-8">
          {/* Quicklinks */}
          <div>
            <h4 className="font-bold text-gray-800 mb-3">Quicklinks</h4>
            <ul className="space-y-2">
              <li><a href="#" className="text-gray-500 hover:text-red-600 text-sm transition">Home</a></li>
              <li><a href="#" className="text-gray-500 hover:text-red-600 text-sm transition">News</a></li>
              <li><a href="#" className="text-gray-500 hover:text-red-600 text-sm transition">Where to Buy</a></li>
              <li><a href="#" className="text-gray-500 hover:text-red-600 text-sm transition">Recalls & Safety</a></li>
            </ul>
          </div>

          {/* Our Company */}
          <div>
            <h4 className="font-bold text-gray-800 mb-3">Our Company</h4>
            <ul className="space-y-2">
              <li><a href="#" className="text-gray-500 hover:text-red-600 text-sm transition">About Us</a></li>
              <li><a href="#" className="text-gray-500 hover:text-red-600 text-sm transition">Careers</a></li>
              <li><a href="#" className="text-gray-500 hover:text-red-600 text-sm transition">Contact</a></li>
            </ul>
          </div>

          {/* Follow Us */}
          <div>
            <h4 className="font-bold text-gray-800 mb-3">Follow Us</h4>
            <ul className="space-y-2">
              <li><a href="#" className="text-gray-500 hover:text-red-600 text-sm transition">Facebook</a></li>
              <li><a href="#" className="text-gray-500 hover:text-red-600 text-sm transition">Instagram</a></li>
              <li><a href="#" className="text-gray-500 hover:text-red-600 text-sm transition">TikTok</a></li>
            </ul>
          </div>

          {/* Policies */}
          <div>
            <h4 className="font-bold text-gray-800 mb-3">Policies</h4>
            <ul className="space-y-2">
              <li><a href="#" className="text-gray-500 hover:text-red-600 text-sm transition">Terms of Use</a></li>
              <li><a href="#" className="text-gray-500 hover:text-red-600 text-sm transition">Privacy Policy</a></li>
              <li><a href="#" className="text-gray-500 hover:text-red-600 text-sm transition">Cookie Policy</a></li>
            </ul>
          </div>
        </div>

        {/* About Us Section */}
        <div className="border-t border-gray-100 pt-6 mt-2">
          <h3 className="font-semibold text-gray-800 mb-2">About Us</h3>
          <p className="text-gray-500 text-sm leading-relaxed">
            We are building a simple e-commerce platform for Fuggler products.
            Our goal is to provide a smooth shopping experience.
          </p>
        </div>

        {/* Developers Link */}
        <div className="mt-4">
          <Link to="/devs" className="text-blue-600 hover:text-blue-800 text-sm transition">
            Meet the Developers →
          </Link>
        </div>

        {/* Copyright */}
        <div className="border-t border-gray-100 mt-6 pt-6 text-center">
          <p className="text-gray-400 text-xs">
            © 2026 Fuggler Shop. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}