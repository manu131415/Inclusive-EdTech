import { useState } from "react";
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

  const playAudio = (lesson: Lesson) => {
    const audio = new Audio(
      `http://localhost:8001/tts?text=${encodeURIComponent(
        lesson.text
      )}&lang=${lesson.language}`
    );
    audio.play();
  };

  return (
    <div style={{ display: "flex", gap: "2rem", padding: "2rem" }}>
      {/* Lesson list */}
      <div style={{ flex: 1 }}>
        <h2>Available Lessons</h2>
        <ul style={{ listStyle: "none", padding: 0 }}>
          {lessons.map(lesson => (
            <li
              key={lesson.id}
              onClick={() => setSelectedLesson(lesson)}
              style={{
                padding: "0.5rem",
                cursor: "pointer",
                border: "1px solid #ccc",
                marginBottom: "0.5rem",
                borderRadius: "5px",
                background: selectedLesson?.id === lesson.id ? "#f0f0f0" : "white",
              }}
            >
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
            <button onClick={() => playAudio(selectedLesson)}>🔊 Listen</button>
          </div>
        ) : (
          <p>Select a lesson to view and listen.</p>
        )}
      </div>
    </div>
  );
}
