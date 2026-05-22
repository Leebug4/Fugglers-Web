import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabase";

export default function Header() {
  const [logo, setLogo] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchLogo();
    checkLogin();
    window.addEventListener("authChange", checkLogin);
    return () => window.removeEventListener("authChange", checkLogin);
  }, []);

  const checkLogin = () => {
    const user = localStorage.getItem("user");
    const role = localStorage.getItem("role");
    setIsLoggedIn(user !== null || role === "admin");
  };

  const fetchLogo = async () => {
    const { data, error } = await supabase
      .from("site_header")
      .select("logo_image")
      .order("id", { ascending: false })
      .limit(1)
      .single();
    if (!error) setLogo(data.logo_image);
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("role");
    setIsLoggedIn(false);
    window.dispatchEvent(new Event("authChange"));
    alert("Logged out successfully");
    navigate("/login");
  };

  const isAdmin = localStorage.getItem("role") === "admin";

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-gray-200 flex justify-between items-center px-5 py-3 shadow-sm">
      {/* Logo */}
      <Link to="/">
        {logo && <img src={logo} alt="Logo" className="h-12 object-contain" />}
      </Link>

      {/* Navigation */}
      <nav className="flex items-center gap-4 flex-wrap">
        {!isAdmin && (
          <>
            <Link to="/" className="text-gray-700 hover:text-red-600 transition">
              Home
            </Link>
            <Link to="/products?category=Plushie Fugglers" className="text-gray-700 hover:text-red-600 transition">
              Plushie
            </Link>
            <Link to="/products?category=Classic Keychain Fuggler" className="text-gray-700 hover:text-red-600 transition">
              Classic
            </Link>
            <Link to="/products?category=Rainbow Keychain Fuggler" className="text-gray-700 hover:text-red-600 transition">
              Rainbow
            </Link>
            <Link to="/products?category=Mini-baby Fugglers" className="text-gray-700 hover:text-red-600 transition">
              Mini
            </Link>
            <Link to="/orders" className="text-gray-700 hover:text-red-600 transition">
              My Orders
            </Link>
            <button
              onClick={() => navigate("/cart")}
              className="bg-red-600 text-white px-3 py-1 rounded-md hover:bg-red-700 transition"
            >
              Cart
            </button>
          </>
        )}

        {isLoggedIn ? (
          <button
            onClick={handleLogout}
            className="bg-gray-800 text-white px-4 py-1 rounded-md hover:bg-gray-900 transition"
          >
            Logout
          </button>
        ) : (
          <button
            onClick={() => navigate("/login")}
            className="bg-black text-white px-4 py-1 rounded-md hover:bg-gray-800 transition"
          >
            Login
          </button>
        )}
      </nav>
    </header>
  );
}