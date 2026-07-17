import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../Style/Intro.css";

function Intro() {
  const navigate = useNavigate();
  const [exit, setExit] = useState(false);

  useEffect(() => {
    const timer1 = setTimeout(() => setExit(true), 2500);
    const timer2 = setTimeout(() => navigate("/home"), 3000);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
    };
  }, [navigate]);

  return (
    <div className={`intro-container ${exit ? "exit" : ""}`}>
      <div className="logo-wrapper">
        <div className="aura"></div>

        <img
          src="/mainlogo.ico"
          alt="Roadi Logo"
          className="intro-logo"
        />
      </div>
    </div>
  );
}

export default Intro;