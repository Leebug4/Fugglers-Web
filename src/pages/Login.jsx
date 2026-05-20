import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { supabase } from "../lib/supabase";

function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // FIXED ADMIN ACCOUNT
  const adminEmail = "admin@gmail.com";
  const adminPassword = "admin123";

  const handleLogin = async (e) => {
    e.preventDefault();

    // ADMIN LOGIN
    if (email === adminEmail && password === adminPassword) {
    localStorage.setItem("role", "admin");

    window.dispatchEvent(new Event("authChange"));

    alert("Admin Login Success");

    navigate("/admin");
    return;
  }

    // BUYER LOGIN
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
    <div style={{ padding: "20px" }}>
      <h1>Login</h1>

      <form onSubmit={handleLogin}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <br />
        <br />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <br />
        <br />

        <button type="submit">Login</button>
      </form>

      <br />

      <Link to="/register">No account yet?</Link>
    </div>
  );
}

export default Login;