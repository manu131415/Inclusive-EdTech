import { useState } from "react";
import "./input.css"

export default function Signup() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch("http://localhost:8001/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, email, password }),
      });
      if (!res.ok) throw new Error("Signup failed");
      const data = await res.json();
      alert(`Signup successful! Welcome ${data.username}`);
    } catch (err) {
      console.error(err);
      alert("Error signing up");
    }
  };

  return (
    <div className="app-container">
      <form className="form" onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1rem", maxWidth: 400, margin: "2rem auto" }}>
      <h2>Signup</h2>
      <input type="text" placeholder="Username" value={username} onChange={e => setUsername(e.target.value)} required />
      <input type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} required />
      <input type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} required />
      <button className="btn" type="submit">Signup</button>
    </form>
    </div>
  );
}
