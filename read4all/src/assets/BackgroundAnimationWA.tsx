import React, { useEffect, useRef } from "react";

interface ColorBubbleBackgroundProps {
  bubbleCount?: number;
  maxSize?: number;
  speedMultiplier?: number;
  palette?: string[];
  className?: string;
}

const ColorBubbleBackground: React.FC<ColorBubbleBackgroundProps> = ({
  bubbleCount = 18,
  maxSize = 140,
  speedMultiplier = 1,
  palette = ["#FF6B6B", "#FFD93D", "#6BCB77", "#4D96FF", "#9D4EDD"],
  className = "relative inset-0 z-0",
}) => {
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    container.innerHTML = "";

    for (let i = 0; i < bubbleCount; i++) {
      const bubble = document.createElement("div");
      bubble.className = "cb-bubble";

      const size = Math.round(30 + Math.random() * (maxSize - 30));
      bubble.style.width = `${size}px`;
      bubble.style.height = `${size}px`;
      bubble.style.left = `${Math.random() * 100}%`;
      bubble.style.bottom = `${-Math.random() * 40 - 10}px`;

      const color = palette[Math.floor(Math.random() * palette.length)];
      bubble.style.background = `radial-gradient(circle at 30% 30%, rgba(255,255,255,0.75), ${color})`;

      const duration = (8 + Math.random() * 10) / speedMultiplier;
      const delay = Math.random() * -duration;
      bubble.style.animation = `cb-float ${duration}s linear ${delay}s infinite`;

      const drift = (Math.random() * 2 - 1) * 20;
      bubble.style.setProperty("--drift", `${drift}px`);
      bubble.style.filter = `blur(${Math.random() * 6}px)`;
      bubble.style.zIndex = `${Math.floor(100 - size)}`;

      container.appendChild(bubble);
    }

    const onResize = () => {
      if(containerRef.current){
        container.innerHTML = "";
      }
      
    };

    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [bubbleCount, maxSize, speedMultiplier, palette]);

  return (
    <div className={`${className} overflow-hidden`}>
    
      <style>{`
        *{
          margin: 0; 
          padding: 0; 
          box-sizing: border-box; 
          -webkit-font-smoothing: antialiased; 
          -moz-osx-font-smoothing: grayscale;
        }
        .cb-root {
          position: absolute;
          inset: 0;
          z-index: 0;
          background: linear-gradient(120deg, ${palette[0]}, ${palette[1]});
          background-size: 400% 400%;
          animation: cb-shift 15s ease-in-out infinite;
          filter: saturate(1.05);
        }

        @keyframes cb-shift {
          0% { background-position: 0% 50%; }
          25% { background-position: 50% 50%; }
          50% { background-position: 100% 50%; }
          75% { background-position: 50% 50%; }
          100% { background-position: 0% 50%; }
        }

        .cb-bubble {
          position: absolute;
          bottom: -60px;
          transform: translateX(0) translateY(0) scale(1);
          border-radius: 999px;
          opacity: 0.85;
          mix-blend-mode: screen;
          box-shadow: 0 6px 28px rgba(0,0,0,0.12), inset -6px -6px 30px rgba(255,255,255,0.08);
          will-change: transform, opacity, filter;
        }

        @keyframes cb-float {
          0% {
            transform: translateX(0) translateY(0) scale(0.95);
            opacity: 0.0;
          }
          6% { opacity: 0.85; }
          50% {
            transform: translateX(var(--drift)) translateY(-100vh) scale(1.05);
            opacity: 0.9;
          }
          100% {
            transform: translateX(calc(var(--drift) * -1)) translateY(-200vh) scale(0.9);
            opacity: 0;
          }
        }

        .cb-vignette {
          position: absolute;
          inset: 0;
          pointer-events: none;
          background: radial-gradient(60% 60% at 50% 40%, rgba(255,255,255,0.02), rgba(0,0,0,0.12));
          z-index: 30;
        }

        .cb-bubble-layer {
          position: absolute;
          inset: 0;
          z-index: 10;
          overflow: hidden;
        }
      `}</style>

      <div className="cb-root" />
      <div ref={containerRef} className="cb-bubble-layer" />
      <div className="cb-vignette" />

      {/* <div className="relative z-10 flex items-center justify-center h-full p-6">
        <div className="max-w-3xl text-center">
          <h1 className="text-3xl md:text-5xl font-extrabold text-white drop-shadow-lg">
            Beautiful, ever-changing bubbles
          </h1>
          <p className="mt-3 text-white/90">
            Use this component as a background or hero animation — tweak colors, speed and density via props.
          </p>
        </div>
      </div> */}
    </div>

  );
};

export default ColorBubbleBackground;
