import { useEffect, useRef } from "react";
import type { Meteor, Particle, Spark } from "./types";
import {
  drawMeteor,
  drawParticles,
  drawSparks,
} from "./Renderer";
import {
  spawnParticles,
  updateParticles,
} from "./Physics";

function MeteorCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;

    if (!canvas) return;

    const ctx = canvas.getContext("2d");

    if (!ctx) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const meteor: Meteor = {
      id: 1,

      x: canvas.width + 150,
      y: -100,

      vx: -8,
      vy: 5,

      ax: 0,
      ay: 0,

      color: "#ffffff",
    };

    const particles: Particle[] = [];
    const sparks: Spark[] = [];

    let animationFrame: number;

    function updateMeteor() {
      meteor.x += meteor.vx;
      meteor.y += meteor.vy;
    }

    function animate() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Stop once meteor leaves screen
      if (
        meteor.x > -200 &&
        meteor.y < canvas.height + 200
      ) {
        updateMeteor();

        spawnParticles(
          meteor,
          particles,
          sparks
        );

        updateParticles(
          particles,
          sparks
        );

        drawParticles(
          ctx,
          particles,
          meteor
        );

        drawSparks(
          ctx,
          sparks
        );

        drawMeteor(
          ctx,
          meteor
        );
      }

      animationFrame =
        requestAnimationFrame(animate);
    }

    animate();

    return () =>
      cancelAnimationFrame(animationFrame);
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 z-10 pointer-events-none"
    />
  );
}

export default MeteorCanvas;