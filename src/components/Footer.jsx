import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer
      style={{
        marginTop: "40px",
        padding: "30px 20px",
        borderTop: "1px solid #ddd",
      }}
    >
      <h2 style={{ marginBottom: "20px" }}>
        Cute cuddly monsters for you.
      </h2>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(4, 1fr)",
          gap: "20px",
        }}
      >
        <div>
          <h4>Quicklinks</h4>
          <a href="#">Home</a><br />
          <a href="#">News</a><br />
          <a href="#">Where to Buy</a><br />
          <a href="#">Recalls & Safety</a>
        </div>

        <div>
          <h4>Our Company</h4>
          <a href="#">About Us</a><br />
          <a href="#">Careers</a><br />
          <a href="#">Contact</a>
        </div>

        <div>
          <h4>Follow Us</h4>
          <a href="#">Facebook</a><br />
          <a href="#">Instagram</a><br />
          <a href="#">TikTok</a>
        </div>

        <div>
          <h4>Policies</h4>
          <a href="#">Terms of Use</a><br />
          <a href="#">Privacy Policy</a><br />
          <a href="#">Cookie Policy</a>
        </div>
      </div>

      {/* ABOUT US */}
      <div style={{ marginTop: "25px" }}>
        <h3>About Us</h3>
        <p>
          We are building a simple e-commerce platform for Fuggler products.
          Our goal is to provide a smooth shopping experience.
        </p>
      </div>

      {/* DEVELOPERS LINK */}
      <div style={{ marginTop: "15px" }}>
        <Link to="/devs">Meet the Developers</Link>
      </div>

      <p style={{ marginTop: "20px", fontSize: "12px" }}>
        © 2026 Fuggler Shop
      </p>
    </footer>
  );
}