import { useState, useEffect } from "react";
import Navbar from "./assets/Navbar";
import Lessons from "./assets/Lessons";
import Login from "./assets/Login";
import Signup from "./assets/Signup";
import Home from "./assets/Home";
import "./App.css";
import About from "./assets/About";
import Footer from "./assets/Footer";
import ColorBubbleBackground from "./assets/BackgroundAnimationWA";

function App() {
  const [view, setView] = useState<"home" | "lesson" |"login" | "signup">("home");
  

 
  useEffect(() => {
  if (window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    console.log("Reduced motion is enabled, animations skipped."); // <--- LOOK FOR THIS!
    return;
  }
  console.log("Reduced motion is NOT enabled, attempting animations."); // <--- OR THIS!
  // ... rest of your animation code
}, []);

  return (
    <div className="relative h-full">

      <ColorBubbleBackground className="relative inset-0 z-0"/>
      {/* 🌈 Full-screen background layer */}
      
      {/* 💻 App content (always above background) */}
      <div className="relative z-10">
        
        <Navbar setView={setView} />

        {view === "home" && (
          <div className="app-container">
            <Home />
            <About />
            
          </div>
        )}
        {view === "lesson" && <Lessons />}
        {view === "login" && <Login/>}
        {view === "signup" && <Signup/>}
        <Footer />
      </div>
    </div>
  );
}

export default App;
