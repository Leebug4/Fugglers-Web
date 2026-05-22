export default function Hero({ bannerImage }) {
  return (
    <section className="flex flex-col md:flex-row justify-between items-center gap-8 px-5 py-10 max-w-6xl mx-auto">
      <div className="flex-1 text-center md:text-left">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-800">
          Welcome to the Fuggler Shop!
        </h1>
        <p className="text-gray-500 text-lg mt-2">
          Adopt your favorite mischievous monster before someone else does!
        </p>
      </div>
      <div className="flex-1 flex justify-center md:justify-end">
        {bannerImage && (
          <img
            src={bannerImage}
            alt="Fuggler Banner"
            className="w-full max-w-md rounded-xl shadow-md object-contain"
          />
        )}
      </div>
    </section>
  );
}