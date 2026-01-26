import { useEffect, useRef } from "react";

const ParticleBackground = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const createParticle = () => {
      const particle = document.createElement("div");
      particle.className = "particle";
      
      const size = Math.random() * 4 + 2;
      const x = Math.random() * 100;
      const delay = Math.random() * 15;
      const duration = Math.random() * 10 + 10;
      const hue = Math.random() > 0.5 ? 186 : 285;
      
      particle.style.width = `${size}px`;
      particle.style.height = `${size}px`;
      particle.style.left = `${x}%`;
      particle.style.background = `hsl(${hue} 100% 50%)`;
      particle.style.animationDelay = `${delay}s`;
      particle.style.animationDuration = `${duration}s`;
      particle.style.boxShadow = `0 0 ${size * 2}px hsl(${hue} 100% 50%)`;
      
      container.appendChild(particle);

      setTimeout(() => {
        particle.remove();
      }, (delay + duration) * 1000);
    };

    // Initial particles
    for (let i = 0; i < 30; i++) {
      createParticle();
    }

    // Continuous particle creation
    const interval = setInterval(() => {
      createParticle();
    }, 500);

    return () => {
      clearInterval(interval);
      container.innerHTML = "";
    };
  }, []);

  return (
    <div 
      ref={containerRef} 
      className="particles fixed inset-0 pointer-events-none z-0"
    />
  );
};

export default ParticleBackground;
