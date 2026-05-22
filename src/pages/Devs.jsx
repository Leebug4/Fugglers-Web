import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Beloro from "../assets/Devs_beloro.webp";
import Tala from "../assets/Devs_Tala.webp";
import Reyes from "../assets/Devs_Reyes.webp";
import Cabugawan from "../assets/Devs_Cabugawan.webp";
import Santiago from "../assets/Devs_Santiago.webp";

function Devs() {
  const navigate = useNavigate();

  useEffect(() => {
    const user = localStorage.getItem("user");
    if (!user) navigate("/login");
  }, []);

  const team = [
    { name: "Sophia Rhyzelle T. Beloro", role: "Project Manager", img: Beloro, desc: "Responsible for overseeing the planning and execution of the project. Also contributed to layout design." },
    { name: "Mark Jayson B. Tala", role: "Lead Programmer", img: Tala, desc: "Primarily responsible for the development and structuring of the Front-end and back-end Database functionalities of the system." },
    { name: "Rom Jerico T. Reyes", role: "Lead Front-End Programmer", img: Reyes, desc: "Mainly handled the development of the front-end interface and design elements." },
    { name: "John Mark C. Cabugawan", role: "Front-End Programmer", img: Cabugawan, desc: "Assisted in developing the front-end components and user interface of the system." },
    { name: "Roseshyne Santiago", role: "Back-End Programmer", img: Santiago, desc: "Assisted in developing the back-end components and Database Infrastructure of the system." },
  ];

  return (
    <div className="p-5 max-w-6xl mx-auto">
      <h2 className="text-3xl font-bold text-center mb-6">About Us</h2>
      <div className="bg-gray-50 p-6 rounded-lg mb-10 border border-gray-200">
        <p className="text-gray-700 leading-relaxed">
          We are the developers behind Fuggler Store — a team of passionate students and aspiring programmers dedicated to creating a fun, interactive, and user-friendly online shopping experience. Inspired by the unique and quirky world of Fugglers, we developed this website to showcase our creativity, teamwork, and skills in modern web development, system design, and e-commerce functionality.
        </p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {team.map((member, idx) => (
          <div key={idx} className="border border-gray-200 rounded-xl p-5 shadow-sm hover:shadow-md transition bg-white">
            <img src={member.img} alt={member.name} className="w-32 h-32 object-cover rounded-full mx-auto mb-4" />
            <b className="block text-center text-lg">{member.name}</b>
            <p className="text-center text-red-600 font-semibold mt-1">{member.role}</p>
            <p className="text-gray-600 text-sm mt-3 text-center">{member.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Devs;