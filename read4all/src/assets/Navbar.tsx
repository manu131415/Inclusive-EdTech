import React from "react";

interface NavbarProps {
  setView: React.Dispatch<React.SetStateAction<"home" | "login" | "signup">>;
}

function Navbar({ setView }: NavbarProps) {
  return (
    <div className="header">
      <h1>Inclusive EduTech</h1>
      <nav className="nav-list">
        <ul style={{ listStyle: "none", display: "flex", gap: "1rem" }}>
        <li><button className="btn" onClick={() => setView("home")}>Home</button></li>
        <li><button className="btn" onClick={() => setView("login")}>Login</button></li>
        <li><button className="btn" onClick={() => setView("signup")}>Sign Up</button></li>
      </ul>
      </nav>
    </div>
  );
}

export default Navbar;
