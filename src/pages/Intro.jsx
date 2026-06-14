import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../Style/Intro.css";

function Intro() {
  const navigate = useNavigate();
  const text = "CRM";
  const [exit, setExit] = useState(false);

  const stagger = 0.5; // seconds per letter
  const letterDuration = 0.8; // duration of each letter animation

  const taglineDelay = text.length * stagger + letterDuration; // last letter finish
  const stayDelay = 1.0; // extra time to stay visible before fading

  useEffect(() => {
    // Fade out after letters + tagline + stayDelay
    const exitTimer = setTimeout(() => setExit(true), (taglineDelay + stayDelay) * 1000);

    // Navigate a bit after fade-out for smooth transition
    const navTimer = setTimeout(() => navigate("/home"), (taglineDelay + stayDelay + 0.5) * 1000);

    return () => {
      clearTimeout(exitTimer);
      clearTimeout(navTimer);
    };
  }, [navigate, taglineDelay, stayDelay]);

  return (
    <div className={`intro-container ${exit ? "exit" : ""}`}>
      <div className="logo">
        {text.split("").map((char, index) => (
          <span
            key={index}
            style={{ animationDelay: `${index * stagger}s`, animationDuration: `${letterDuration}s` }}
          >
            {char}
          </span>
        ))}
      </div>
      <p className="tagline" style={{ animationDelay: `${taglineDelay}s` }}>
        Customer Relationship Management
      </p>
    </div>
  );
}

export default Intro;
