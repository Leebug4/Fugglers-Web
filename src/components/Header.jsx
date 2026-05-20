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

    return () => {
      window.removeEventListener("authChange", checkLogin);
    };
  }, []);

  const checkLogin = () => {
    const user = localStorage.getItem("user");
    const role = localStorage.getItem("role");

    if (user !== null || role === "admin") {
      setIsLoggedIn(true);
    } else {
      setIsLoggedIn(false);
    }
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
    <header
      style={{
        position: "sticky",
        top: 0,
        zIndex: 1000,
        background: "white",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "15px 20px",
        borderBottom: "1px solid #ddd",
      }}
    >
      {/* LOGO */}
      <div>
        <Link to="/">
          {logo && (
            <img src={logo} alt="Logo" style={{ height: "60px" }} />
          )}
        </Link>
      </div>

      {/* NAV */}
      <nav style={{ display: "flex", gap: "15px", alignItems: "center" }}>

        {/* 👇 BUYER NAV ONLY (HIDDEN IF ADMIN) */}
        {!isAdmin && (
          <>
            <Link to="/">Home</Link>

            <Link to="/products?category=Plushie Fugglers">Plushie</Link>
            <Link to="/products?category=Classic Keychain Fuggler">Classic</Link>
            <Link to="/products?category=Rainbow Keychain Fuggler">Rainbow</Link>
            <Link to="/products?category=Mini-baby Fugglers">Mini</Link>

            <Link to="/orders">My Orders</Link>

            {/* CART BUTTON */}
            <button onClick={() => navigate("/cart")}>
              Cart
            </button>
          </>
        )}

        {/* LOGIN / LOGOUT */}
        {isLoggedIn ? (
          <button onClick={handleLogout}>Logout</button>
        ) : (
          <button onClick={() => navigate("/login")}>Login</button>
        )}
      </nav>
    </header>
  );
}