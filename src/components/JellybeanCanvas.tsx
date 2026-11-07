import React, { useEffect, useRef } from 'react';
import confetti from 'canvas-confetti';
import { sugarRushAudio } from '../audio/sugarRushSynth';

interface Jellybean {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radiusX: number;
  radiusY: number;
  rotation: number;
  rotationSpeed: number;
  color: string;
  glowColor: string;
  shape: 'jellybean' | 'gummy-bear' | 'candy-star' | 'sprinkle';
  bounceCount: number;
  alpha: number;
}

const CANDY_PALETTE = [
  { color: '#ff2a7a', glow: '#ff7eb3' },
  { color: '#00e5c9', glow: '#7affea' },
  { color: '#ffd600', glow: '#fff176' },
  { color: '#9d4edd', glow: '#c77dff' },
  { color: '#ff7b00', glow: '#ffa24b' },
  { color: '#06d6a0', glow: '#70efcc' },
  { color: '#ef476f', glow: '#f78ca0' },
];

interface JellybeanCanvasProps {
  burstTrigger?: number;
}

export const JellybeanCanvas: React.FC<JellybeanCanvasProps> = ({ burstTrigger = 0 }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const jellybeansRef = useRef<Jellybean[]>([]);
  const animationFrameId = useRef<number | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    handleResize();
    window.addEventListener('resize', handleResize);

    const initialBeans: Jellybean[] = [];
    const count = Math.min(24, Math.floor(window.innerWidth / 50));
    for (let i = 0; i < count; i++) {
      const palette = CANDY_PALETTE[Math.floor(Math.random() * CANDY_PALETTE.length)];
      const shapes: Jellybean['shape'][] = ['jellybean', 'candy-star', 'sprinkle', 'gummy-bear'];
      initialBeans.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 1.2,
        vy: 0.5 + Math.random() * 1.2,
        radiusX: 10 + Math.random() * 12,
        radiusY: 7 + Math.random() * 8,
        rotation: Math.random() * Math.PI * 2,
        rotationSpeed: (Math.random() - 0.5) * 0.04,
        color: palette.color,
        glowColor: palette.glow,
        shape: shapes[Math.floor(Math.random() * shapes.length)],
        bounceCount: 0,
        alpha: 0.85 + Math.random() * 0.15,
      });
    }
    jellybeansRef.current = initialBeans;

    const ctx = canvas.getContext('2d');
    let lastTime = performance.now();

    const loop = (currentTime: number) => {
      if (!ctx || !canvas) return;
      const dt = Math.min((currentTime - lastTime) / 1000, 0.1);
      lastTime = currentTime;

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const beans = jellybeansRef.current;
      for (let i = beans.length - 1; i >= 0; i--) {
        const b = beans[i];

        b.vy += 2.5 * dt;
        b.x += b.vx;
        b.y += b.vy;
        b.rotation += b.rotationSpeed;

        if (b.x < b.radiusX) {
          b.x = b.radiusX;
          b.vx *= -0.7;
        } else if (b.x > canvas.width - b.radiusX) {
          b.x = canvas.width - b.radiusX;
          b.vx *= -0.7;
        }

        if (b.y > canvas.height - b.radiusY) {
          b.y = canvas.height - b.radiusY;
          b.vy *= -0.65;
          b.vx *= 0.85;
          b.bounceCount += 1;

          if (b.bounceCount > 4 || Math.abs(b.vy) < 0.8) {
            b.y = -20;
            b.x = Math.random() * canvas.width;
            b.vy = 0.5 + Math.random() * 1.5;
            b.vx = (Math.random() - 0.5) * 1.5;
            b.bounceCount = 0;
          }
        }

        ctx.save();
        ctx.translate(b.x, b.y);
        ctx.rotate(b.rotation);
        ctx.globalAlpha = b.alpha;

        if (b.shape === 'jellybean') {
          ctx.beginPath();
          ctx.ellipse(0, 0, b.radiusX, b.radiusY, 0, 0, Math.PI * 2);
          ctx.fillStyle = b.color;
          ctx.shadowColor = b.glowColor;
          ctx.shadowBlur = 8;
          ctx.fill();

          ctx.beginPath();
          ctx.ellipse(-b.radiusX * 0.35, -b.radiusY * 0.35, b.radiusX * 0.35, b.radiusY * 0.3, Math.PI / 4, 0, Math.PI * 2);
          ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
          ctx.shadowBlur = 0;
          ctx.fill();
        } else if (b.shape === 'candy-star') {
          ctx.fillStyle = b.color;
          ctx.shadowColor = b.glowColor;
          ctx.shadowBlur = 10;
          ctx.beginPath();
          for (let s = 0; s < 5; s++) {
            ctx.lineTo(Math.cos(((18 + s * 72) * Math.PI) / 180) * b.radiusX, -Math.sin(((18 + s * 72) * Math.PI) / 180) * b.radiusX);
            ctx.lineTo(Math.cos(((54 + s * 72) * Math.PI) / 180) * (b.radiusX * 0.45), -Math.sin(((54 + s * 72) * Math.PI) / 180) * (b.radiusX * 0.45));
          }
          ctx.closePath();
          ctx.fill();
        } else if (b.shape === 'gummy-bear') {
          ctx.fillStyle = b.color;
          ctx.shadowColor = b.glowColor;
          ctx.shadowBlur = 6;
          ctx.beginPath();
          ctx.ellipse(0, 4, b.radiusX * 0.7, b.radiusY * 0.8, 0, 0, Math.PI * 2);
          ctx.fill();
          ctx.beginPath();
          ctx.arc(0, -6, b.radiusX * 0.55, 0, Math.PI * 2);
          ctx.fill();
          ctx.beginPath();
          ctx.arc(-b.radiusX * 0.45, -11, b.radiusX * 0.25, 0, Math.PI * 2);
          ctx.arc(b.radiusX * 0.45, -11, b.radiusX * 0.25, 0, Math.PI * 2);
          ctx.fill();
        } else {
          ctx.fillStyle = b.color;
          ctx.shadowColor = b.glowColor;
          ctx.shadowBlur = 4;
          ctx.beginPath();
          ctx.roundRect(-b.radiusX, -3, b.radiusX * 2, 6, 3);
          ctx.fill();
        }

        ctx.restore();
      }

      animationFrameId.current = requestAnimationFrame(loop);
    };

    animationFrameId.current = requestAnimationFrame(loop);

    return () => {
      window.removeEventListener('resize', handleResize);
      if (animationFrameId.current) cancelAnimationFrame(animationFrameId.current);
    };
  }, []);

  const triggerCandyBurst = (originX?: number, originY?: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    sugarRushAudio.playPopSound();

    confetti({
      particleCount: 45,
      spread: 70,
      origin: {
        x: (originX ?? canvas.width / 2) / canvas.width,
        y: (originY ?? canvas.height / 2) / canvas.height,
      },
      colors: ['#ff2a7a', '#00e5c9', '#ffd600', '#9d4edd', '#ff7b00', '#ffffff'],
      shapes: ['circle', 'square'],
      scalar: 1.2,
    });
  };

  useEffect(() => {
    if (burstTrigger > 0) {
      triggerCandyBurst();
    }
  }, [burstTrigger]);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-10 w-full h-full opacity-90"
    />
  );
};

export const triggerGlobalCandyBurst = () => {
  sugarRushAudio.playPopSound();
  confetti({
    particleCount: 65,
    spread: 90,
    origin: { y: 0.6 },
    colors: ['#ff2a7a', '#00e5c9', '#ffd600', '#9d4edd', '#ff7b00', '#ffffff'],
    scalar: 1.3,
  });
};
