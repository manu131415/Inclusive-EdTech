import { useEffect, useState } from "react";
import "./lessons.css";
import sampleLessons from "./samplelessons.ts";

interface Lesson {
  id: number;
  title: string;
  text: string;
  language: string;
}

export default function PrivateLessons() {
  const [lessons, setLessons] = useState<Lesson[]>(sampleLessons);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentAudio, setCurrentAudio] = useState<HTMLAudioElement | null>(null);
  // const [selectedLang, setSelectedLang] = useState("en"); // 🌍 current TTS language

  useEffect(() => {
    const fetchLessons = async () => {
      try {
        const res = await fetch("http://localhost:8000/lessons");
        if (!res.ok) throw new Error("Failed to fetch lessons");
        const data = await res.json();
        setLessons(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchLessons();
  }, []);

  const handleSpeak = async (text: string) => {
    if (currentAudio) currentAudio.pause();
    try {
      const res = await fetch(`http://localhost:8000/tts?text=${encodeURIComponent(text)}&lang=en`)
;
      if (!res.ok) throw new Error("TTS failed");

      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const audio = new Audio(url);
      setCurrentAudio(audio);
      audio.play();
    } catch (err) {
      console.error(err);
      alert("Error playing audio");
    }
  };

  const handlePause = () => {
    if (currentAudio) currentAudio.pause();
  };

  if (loading) return <p>Loading lessons...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div className="private-container">
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <h2>Private Lessons</h2> <br/>

        {/* 🌍 Language Dropdown */}
        {/* <select
          value={selectedLang}
          onChange={(e) => setSelectedLang(e.target.value)}
          style={{ padding: "0.3rem", borderRadius: "6px" }}
        >
          <option value="en">English</option>
          <option value="hi">Hindi</option>
          <option value="fr">French</option>
          <option value="es">Spanish</option>
          <option value="de">German</option>
        </select> */}
      </div>

      <div className="lessons-container">
        <ul>
          {lessons.map((lesson) => (
            <li
              key={lesson.id}
              style={{
                marginBottom: "1rem",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <div>
                <h3>{lesson.title}</h3>
                <p>{lesson.text}</p>
              </div>
              <div style={{ display: "flex", gap: "0.5rem" }}>
                <button className="btn" onClick={() => handleSpeak(lesson.text)}>
                  🔊 Play
                </button>
                <button className="btn" onClick={handlePause}>
                  ⏸️ Pause
                </button>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
