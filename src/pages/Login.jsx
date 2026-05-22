import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { supabase } from "../lib/supabase";

function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const adminEmail = "admin@gmail.com";
  const adminPassword = "admin123";

  const handleLogin = async (e) => {
    e.preventDefault();
    if (email === adminEmail && password === adminPassword) {
      localStorage.setItem("role", "admin");
      window.dispatchEvent(new Event("authChange"));
      alert("Admin Login Success");
      navigate("/admin");
      return;
    }
    const { data, error } = await supabase
      .from("users")
      .select("*")
      .eq("email", email)
      .eq("password", password)
      .eq("role", "buyer")
      .single();
    if (error || !data) {
      alert("Invalid Email or Password");
      return;
    }
    localStorage.setItem("role", "buyer");
    localStorage.setItem("user", JSON.stringify(data));
    window.dispatchEvent(new Event("authChange"));
    alert("Buyer Login Success");
    navigate("/home");
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white border border-gray-200 rounded-lg shadow-md">
      <h1 className="text-3xl font-bold text-center mb-6">Login</h1>
      <form onSubmit={handleLogin} className="space-y-4">
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-300"
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-300"
        />
        <button
          type="submit"
          className="w-full bg-black text-white py-2 rounded-md hover:bg-gray-800 transition"
        >
          Login
        </button>
      </form>
      <div className="text-center mt-4">
        <Link to="/register" className="text-blue-600 hover:underline text-sm">
          No account yet? Register
        </Link>
      </div>
    </div>
  );
}

export default Login;