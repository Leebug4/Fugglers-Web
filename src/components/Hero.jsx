export default function Hero({ bannerImage }) {
  return (
    <section
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "40px 20px",
        gap: "30px",
        flexWrap: "wrap",
      }}
    >
      {/* LEFT */}
      <div style={{ flex: 1 }}>
        <h1 style={{ fontSize: "42px" }}>
          Welcome to the Fuggler Shop!
        </h1>

        <p style={{ fontSize: "18px", color: "#666" }}>
          Adopt your favorite mischievous monster before someone else does!
        </p>
      </div>

      {/* RIGHT IMAGE */}
      <div style={{ flex: 1, textAlign: "center" }}>
        {bannerImage && (
          <img
            src={bannerImage}
            alt="Fuggler Banner"
            style={{
              width: "100%",
              maxWidth: "500px",
              borderRadius: "20px",
            }}
          />
        )}
      </div>
    </section>
  );
}