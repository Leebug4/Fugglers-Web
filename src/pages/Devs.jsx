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

    if (!user) {
      navigate("/login");
    }
  }, []);

  const team = [
    {
      name: "Sophia Rhyzelle T. Beloro",
      role: "Project Manager",
      img: Beloro,
      desc:
        "Responsible for overseeing the planning and execution of the project. Also contributed to layout design."
    },
    {
      name: "Mark Jayson B. Tala",
      role: "Lead Programmer",
      img: Tala,
      desc:
        "Primarily responsible for the development and structuring of the Front-end and back-end Database functionalities of the system."
    },
    {
      name: "Rom Jerico T. Reyes",
      role: "Lead Front-End Programmer",
      img: Reyes,
      desc:
        "Mainly handled the development of the front-end interface and design elements."
    },
    {
      name: "John Mark C. Cabugawan",
      role: "Front-End Programmer",
      img: Cabugawan,
      desc:
        "Assisted in developing the front-end components and user interface of the system."
    },
    {
      name: "Roseshyne Santiago",
      role: "Back-End Programmer",
      img: Santiago,
      desc:
        "Assisted in developing the back-end components and Database Infrastructure of the system."
    },
    
  ];

  return (
    <div style={styles.page}>
      <h2>About Us</h2>

      <div style={styles.textBox}>
        <p>
          We are the developers behind Fuggler Store — a team of passionate students and aspiring programmers dedicated to creating a fun, interactive, and user-friendly online shopping experience. Inspired by the unique and quirky world of Fugglers, we developed this website to showcase our creativity, teamwork, and skills in modern web development, system design, and e-commerce functionality.
        </p>
      </div>

      {/* TEAM GRID */}
      <div style={styles.grid}>
        {team.map((member, index) => (
          <div key={index} style={styles.card}>
            <img src={member.img} alt={member.name} style={styles.img} />
            <b>{member.name}</b>
            <p>{member.role}</p>
            <p>{member.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

const styles = {
  page: {
    padding: 20,
    fontFamily: "Arial"
  },
  textBox: {
    marginBottom: 20
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
    gap: 15
  },
  card: {
    border: "1px solid #ddd",
    padding: 15,
    borderRadius: 8
  },
  img: {
    width: 120,
    height: 120,
    objectFit: "cover",
    marginBottom: 10
  }
};

export default Devs;