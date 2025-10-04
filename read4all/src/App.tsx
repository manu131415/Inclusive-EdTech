import { useState } from "react";
import Navbar from "./assets/Navbar";
import Lessons from "./assets/Lessons";
import Login from "./assets/Login";
import Signup from "./assets/Signup";
import Home from "./assets/Home";
import ".//App.css"
import Footer from "./assets/Footer";

function App() {
  const [view, setView] = useState<"home" | "login" | "signup">("home");
  const [text, setText] = useState("");
  const [audioUrl, setAudioUrl] = useState("");

  const handleGenerateTTS = async () => {
    if (!text.trim()) return;

    try {
      const response = await fetch(
        `http://localhost:8001/tts?text=${encodeURIComponent(text)}&lang=en`
      );

      if (!response.ok) throw new Error("TTS request failed");

      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      setAudioUrl(url);
    } catch (error) {
      console.error("Error generating TTS:", error);
    }
  };

  return (
    <>
    <div>
      <Navbar setView={setView} />

      {/* Debug line */}

      {/* Conditional rendering */}
      {view === "home" && (
        <>
         <Home />
        <section>
          
          <h1>Read4All - Learn with Audio</h1>
          <Lessons />

          <section style={{ padding: "2rem", fontFamily: "sans-serif" }}>
            <h2>TTS Demo</h2>
            <textarea
              rows={4}
              cols={50}
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Type text here..."
            />
            <br />
            <button className="btn" onClick={handleGenerateTTS} style={{ marginTop: "1rem" }}>
              Generate Speech
            </button>

            {audioUrl && (
              <div style={{ marginTop: "1rem" }}>
                <h3>Result:</h3>
                <audio controls src={audioUrl} autoPlay />
              </div>
            )}
          </section>
        </section>
        </>
      )}

      {view === "login" && <Login />}
      {view === "signup" && <Signup />}
    </div>
    <Footer />
    </>
  );
}

export default App;
