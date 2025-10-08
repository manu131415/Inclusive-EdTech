import { useState } from "react";
import "./input.css"

type ViewType = "home" | "lesson" | "login" | "signup" | "privateLessons";
interface LoginProps {
  setView: React.Dispatch<React.SetStateAction<ViewType>>;
}
export default function Login({ setView }: LoginProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const[message, setMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch("http://localhost:8000/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      if (!res.ok) throw new Error("Login failed");

      const data = await res.json();
      alert(`Welcome back, ${data.email}`);
      
 

      setTimeout(() => {
        setMessage("Login successful! Redirecting...");
        setView("privateLessons"); // ✅ Correct
      }, 1000);
    } catch (err) {
      console.error(err);
      alert("Invalid credentials");
      setMessage("Login failed. Please try again.");
    }
  };

  return (
    <div className="login-container">
      <form className="form" onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1rem", margin: "2rem auto" }}>
      <h2>Login</h2>
      <input type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} required />
      <input type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} required />
      <button className="btn" type="submit">Login</button>
       {message && <p style={{ color: "red", marginTop: "0.5rem" ,fontSize: "10px"}}>{message}</p>}
    </form>
    </div>
  );
}
