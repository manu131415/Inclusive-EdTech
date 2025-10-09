// PrivateLessons.tsx
import { useEffect, useState } from "react";
import "./lessons.css"
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

  useEffect(() => {
    const fetchLessons = async () => {
      try {
        const res = await fetch("http://localhost:8000/lessons", {
          method: "GET",
        });
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

  if (loading) return <p>Loading lessons...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <>
    <div className="private-container">
       <h2>Private Lessons</h2> <br/>
      <div className="lessons-container">
      <ul>
        {lessons.map((lesson) => (
          <li key={lesson.id} style={{ marginBottom: "1rem" }}>
            <h3>{lesson.title}</h3>
            <p>{lesson.text}</p>
            <small>Language: {lesson.language}</small>
          </li>
        ))}
      </ul>
    </div>
  </div>
  </>
  );
}
