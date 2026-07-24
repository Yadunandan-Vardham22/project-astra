import { useEffect, useRef } from "react";

type Particle = {
  x: number;
  y: number;
  size: number;
  life: number;
  vx: number;
  vy: number;
};

function CursorParticles() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;

    if (!canvas) return;

    const ctx = canvas.getContext("2d");

    if (!ctx) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const particles: Particle[] = [];

    let mouse = {
      x: 0,
      y: 0,
    };

    window.addEventListener(
      "mousemove",
      (e) => {
        mouse.x = e.clientX;
        mouse.y = e.clientY;

        particles.push({
          x: mouse.x,
          y: mouse.y,
          size: Math.random() * 2 + 0.5,
          life: 1,
          vx: (Math.random() - 0.5) * 1,
          vy: (Math.random() - 0.5) * 1,
        });
      }
    );

    function animate() {
      ctx.clearRect(
        0,
        0,
        canvas.width,
        canvas.height
      );

      particles.forEach((particle) => {
        particle.x += particle.vx;
        particle.y += particle.vy;

        particle.life -= 0.02;

        ctx.beginPath();

        ctx.fillStyle = `
          rgba(
            190,
            220,
            255,
            ${particle.life}
          )
        `;

        ctx.shadowBlur = 15;

        ctx.shadowColor =
          "rgba(170,210,255,0.9)";

        ctx.arc(
          particle.x,
          particle.y,
          particle.size,
          0,
          Math.PI * 2
        );

        ctx.fill();
      });

      for (
        let i = particles.length - 1;
        i >= 0;
        i--
      ) {
        if (particles[i].life <= 0) {
          particles.splice(i, 1);
        }
      }

      requestAnimationFrame(animate);
    }

    animate();
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="
        absolute
        inset-0
        z-10
        pointer-events-none
      "
    />
  );
}

export default CursorParticles;