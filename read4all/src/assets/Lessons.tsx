import { useState } from "react";
import "./lessons.css"
import sampleLessons from "./samplelessons.ts";

interface Lesson {
  id: number;
  title: string;
  text: string;
  language: string;
}

export default function Lessons() {
  const [lessons] = useState<Lesson[]>(sampleLessons);
  const [selectedLesson, setSelectedLesson] = useState<Lesson | null>(null);
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

  const playAudio = (lesson: Lesson) => {
    const audio = new Audio(
      `http://localhost:8001/tts?text=${encodeURIComponent(
        lesson.text
      )}&lang=${lesson.language}`
    );
    audio.play();
  };

  return (
    <>
    <section className="app-container">
              <h1>Read4All - Learn with Audio</h1>

              <section className="lessons-container" style={{ padding: "2rem", fontFamily: "sans-serif" }}>
                <h2>TTS Demo</h2>
                <textarea
                  rows={4}
                  cols={50}
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  placeholder="Type text here..."
                />
                <br />
                <button
                  className="btn"
                  onClick={handleGenerateTTS}
                  style={{ marginTop: "1rem" }}
                >
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

    <div className="lessons-container">
      {/* Lesson list */}
      <div style={{ flex: 1 }}>
        <h2>Available Lessons</h2>
        <ul>
          {lessons.map(lesson => (
            <li className="lesson-item"
              key={lesson.id}
              onClick={() => setSelectedLesson(lesson)}>
              {lesson.title} ({lesson.language})
            </li>
          ))}
        </ul>
      </div>

      {/* Selected lesson detail */}
      <div style={{ flex: 2 }}>
        {selectedLesson ? (
          <div>
            <h2>{selectedLesson.title}</h2>
            <p>{selectedLesson.text}</p>
            <button className="btn" onClick={() => playAudio(selectedLesson)}>🔊 Listen</button>
          </div>
        ) : (
          <p>Select a lesson to view and listen.</p>
        )}
      </div>
    </div>
    </>
  );
}
