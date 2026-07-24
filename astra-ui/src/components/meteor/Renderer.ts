import type { Meteor, Particle, Spark } from "./types";

export function drawParticles(
  ctx: CanvasRenderingContext2D,
  particles: Particle[],
  meteor: Meteor
) {
  const angle = Math.atan2(meteor.vy, meteor.vx);

  particles
    .filter((p) => p.meteorId === meteor.id)
    .forEach((particle) => {
      const alpha = particle.life * particle.life;

      ctx.save();

      ctx.translate(particle.x, particle.y);
      ctx.rotate(angle);

      const length = 10 * particle.life + 2;

      const gradient = ctx.createLinearGradient(
        -length,
        0,
        2,
        0
      );

      gradient.addColorStop(0, "rgba(255,255,255,0)");
      gradient.addColorStop(
        1,
        `rgba(255,255,255,${alpha})`
      );

      ctx.fillStyle = gradient;

      ctx.beginPath();

      ctx.roundRect(
        -length,
        -particle.size / 2,
        length,
        particle.size,
        particle.size
      );

      ctx.fill();

      ctx.restore();
    });
}

export function drawSparks(
  ctx: CanvasRenderingContext2D,
  sparks: Spark[]
) {
  sparks.forEach((spark) => {
    ctx.beginPath();

    ctx.fillStyle = `rgba(255,235,170,${spark.life})`;

    ctx.arc(
      spark.x,
      spark.y,
      spark.size,
      0,
      Math.PI * 2
    );

    ctx.fill();
  });
}

export function drawMeteor(
  ctx: CanvasRenderingContext2D,
  meteor: Meteor
) {
  const { x, y } = meteor;
  const angle = Math.atan2(meteor.vy, meteor.vx);

  ctx.save();

  ctx.translate(x, y);
  ctx.rotate(angle);

  /* -------------------------
     Outer Space Glow
  -------------------------- */

  const outerGlow = ctx.createRadialGradient(
    0,
    0,
    0,
    0,
    0,
    65
  );

  outerGlow.addColorStop(0, "rgba(220,245,255,.28)");
  outerGlow.addColorStop(0.35, "rgba(120,200,255,.15)");
  outerGlow.addColorStop(1, "rgba(120,200,255,0)");

  ctx.fillStyle = outerGlow;

  ctx.beginPath();
  ctx.arc(0, 0, 65, 0, Math.PI * 2);
  ctx.fill();

  /* -------------------------
     Star Flare
  -------------------------- */

  ctx.strokeStyle = "rgba(255,255,255,.45)";
  ctx.lineWidth = 1;

  // Horizontal
  ctx.beginPath();
  ctx.moveTo(-14, 0);
  ctx.lineTo(14, 0);
  ctx.stroke();

  // Vertical
  ctx.beginPath();
  ctx.moveTo(0, -14);
  ctx.lineTo(0, 14);
  ctx.stroke();

  // Diagonal 1
  ctx.beginPath();
  ctx.moveTo(-9, -9);
  ctx.lineTo(9, 9);
  ctx.stroke();

  // Diagonal 2
  ctx.beginPath();
  ctx.moveTo(-9, 9);
  ctx.lineTo(9, -9);
  ctx.stroke();

  /* -------------------------
     Inner Glow
  -------------------------- */

  const innerGlow = ctx.createRadialGradient(
    0,
    0,
    0,
    0,
    0,
    22
  );

  innerGlow.addColorStop(0, "rgba(255,255,255,1)");
  innerGlow.addColorStop(0.45, "rgba(220,245,255,.85)");
  innerGlow.addColorStop(1, "rgba(255,255,255,0)");

  ctx.fillStyle = innerGlow;

  ctx.beginPath();
  ctx.arc(0, 0, 22, 0, Math.PI * 2);
  ctx.fill();

  /* -------------------------
     Main Head
  -------------------------- */

  ctx.beginPath();
  ctx.fillStyle = "#f7fbff";

  ctx.ellipse(
    0,
    0,
    10,
    6,
    0,
    0,
    Math.PI * 2
  );

  ctx.fill();

  /* -------------------------
     Bright Core
  -------------------------- */

  ctx.beginPath();
  ctx.fillStyle = "#ffffff";

  ctx.arc(
    3,
    0,
    4,
    0,
    Math.PI * 2
  );

  ctx.fill();

  /* -------------------------
     Hot Center
  -------------------------- */

  ctx.beginPath();
  ctx.fillStyle = "#ffffff";

  ctx.arc(
    4,
    0,
    1.5,
    0,
    Math.PI * 2
  );

  ctx.fill();

  ctx.restore();
}
export function drawBloom(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  radius: number
) {
  // Outer glow
  const outer = ctx.createRadialGradient(
    x,
    y,
    0,
    x,
    y,
    radius
  );

  outer.addColorStop(0, "rgba(255,255,255,0.12)");
  outer.addColorStop(0.5, "rgba(255,255,255,0.08)");
  outer.addColorStop(1, "rgba(255,255,255,0)");

  ctx.fillStyle = outer;

  ctx.beginPath();
  ctx.arc(x, y, radius, 0, Math.PI * 2);
  ctx.fill();

  // Inner bloom
  const inner = ctx.createRadialGradient(
    x,
    y,
    0,
    x,
    y,
    radius * 0.55
  );

  inner.addColorStop(0, "rgba(255,255,255,1)");
  inner.addColorStop(0.35, "rgba(255,255,255,0.8)");
  inner.addColorStop(1, "rgba(255,255,255,0)");

  ctx.fillStyle = inner;

  ctx.beginPath();
  ctx.arc(
    x,
    y,
    radius * 0.55,
    0,
    Math.PI * 2
  );
  ctx.fill();

  // Hot center
  ctx.beginPath();
  ctx.fillStyle = "#ffffff";
  ctx.arc(
    x,
    y,
    Math.max(radius * 0.08, 4),
    0,
    Math.PI * 2
  );
  ctx.fill();
}