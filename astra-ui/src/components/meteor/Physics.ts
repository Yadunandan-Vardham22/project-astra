import type { Meteor, Particle, Spark } from "./types";

export function updateMeteor(meteor: Meteor) {
  meteor.vx += meteor.ax;
  meteor.vy += meteor.ay;

  meteor.x += meteor.vx;
  meteor.y += meteor.vy;
}

export function spawnParticles(
  meteor: Meteor,
  particles: Particle[],
  sparks: Spark[]
) {
  particles.push({
    x: meteor.x - meteor.vx * 4,
    y: meteor.y - meteor.vy * 4,

    vx: (Math.random() - 0.5) * 0.5,
    vy: (Math.random() - 0.5) * 0.5,

    life: 1,
    size: Math.random() * 2 + 0.5,

    meteorId: meteor.id,
  });

  if (Math.random() < 0.35) {
    sparks.push({
      x: meteor.x,
      y: meteor.y,

      vx: (Math.random() - 0.5) * 2.5,
      vy: (Math.random() - 0.5) * 2.5,

      life: 0.6,
      size: Math.random() * 2 + 1,

      meteorId: meteor.id,
    });
  }
}

export function updateParticles(
  particles: Particle[],
  sparks: Spark[]
) {
  particles.forEach((particle) => {
    particle.x += particle.vx;
    particle.y += particle.vy;

    particle.vx *= 0.98;
    particle.vy *= 0.98;

    particle.life -= 0.025;
  });

  sparks.forEach((spark) => {
    spark.x += spark.vx;
    spark.y += spark.vy;

    spark.vx *= 0.96;
    spark.vy *= 0.96;

    spark.life -= 0.05;
  });

  for (let i = particles.length - 1; i >= 0; i--) {
    if (particles[i].life <= 0) {
      particles.splice(i, 1);
    }
  }

  for (let i = sparks.length - 1; i >= 0; i--) {
    if (sparks[i].life <= 0) {
      sparks.splice(i, 1);
    }
  }
}