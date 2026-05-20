import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { supabase } from "../lib/supabase";

function Register() {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleRegister = async (e) => {
    e.preventDefault();

    // check if email already exists
    const { data: existingUser } = await supabase
      .from("users")
      .select("*")
      .eq("email", email)
      .single();

    if (existingUser) {
      alert("Email already registered");
      return;
    }

    const { error } = await supabase.from("users").insert([
      {
        name,
        email,
        password,
        role: "buyer",
      },
    ]);

    if (error) {
      alert(error.message);
      return;
    }

    alert("Registered Successfully");

    navigate("/login");
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1>Register</h1>

      <form onSubmit={handleRegister}>
        <input
          type="text"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />

        <br />
        <br />

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

        <button type="submit">Register</button>
      </form>

      <br />

      <Link to="/login">Already have an account?</Link>
    </div>
  );
}

export default Register;