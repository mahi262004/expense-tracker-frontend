import { useMemo } from "react";


function NebulaDust({ count = 70 }) {
  const particles = useMemo(() => {
    return Array.from({ length: count }).map((_, i) => {
      const isWarm = Math.random() < 0.4;
      return {
        id: i,
        top: Math.random() * 100,
        left: Math.random() * 100,
        size: Math.random() * 2.2 + 0.8,
        opacity: Math.random() * 0.5 + 0.25,
        color: isWarm ? "var(--auth-gold)" : "#d4d2da",
        driftDuration: Math.random() * 6 + 6, 
        driftDelay: Math.random() * -10, 
        twinkleDuration: Math.random() * 3 + 2,
      };
    });
  }, [count]);

  return (
    <div className="nebula-dust" aria-hidden="true">
      {particles.map((p) => (
        <span
          key={p.id}
          className="nebula-particle"
          style={{
            top: `${p.top}%`,
            left: `${p.left}%`,
            width: `${p.size}px`,
            height: `${p.size}px`,
            background: p.color,
            opacity: p.opacity,
            animationDuration: `${p.driftDuration}s, ${p.twinkleDuration}s`,
            animationDelay: `${p.driftDelay}s, 0s`,
          }}
        />
      ))}
    </div>
  );
}

export default NebulaDust;