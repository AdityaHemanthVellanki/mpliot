'use client';

import { useEffect, useState } from 'react';

export default function ParticlesBackground() {
  const [particles, setParticles] = useState<{
    id: number;
    x: number;
    y: number;
    size: number;
    speed: number;
    opacity: number;
  }[]>([]);

  useEffect(() => {
    const particleCount = window.innerWidth < 768 ? 15 : 30;
    const newParticles = [];

    for (let i = 0; i < particleCount; i++) {
      newParticles.push({
        id: i,
        x: Math.random() * window.innerWidth,
        y: Math.random() * window.innerHeight,
        size: Math.random() * 5 + 1,
        speed: Math.random() * 2 + 1,
        opacity: Math.random() * 0.5 + 0.1,
      });
    }

    setParticles(newParticles);

    const handleResize = () => {
      setParticles(prev => 
        prev.map(p => ({
          ...p,
          x: p.x > window.innerWidth ? window.innerWidth * Math.random() : p.x,
          y: p.y > window.innerHeight ? window.innerHeight * Math.random() : p.y,
        }))
      );
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div className="particles-container">
      {particles.map(particle => (
        <div
          key={particle.id}
          className="particle dark:bg-white/10 bg-primary-light/5"
          style={{
            left: `${particle.x}px`,
            top: `${particle.y}px`,
            width: `${particle.size}px`,
            height: `${particle.size}px`,
            opacity: particle.opacity,
            animationDuration: `${15 + particle.speed * 5}s`,
            animationDelay: `-${Math.random() * 10}s`,
          }}
        />
      ))}
    </div>
  );
} 