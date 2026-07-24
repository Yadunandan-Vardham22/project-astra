export type Particle = {
  x: number;
  y: number;

  vx: number;
  vy: number;

  life: number;
  size: number;

  meteorId: number;
};

export type Spark = {
  x: number;
  y: number;

  vx: number;
  vy: number;

  life: number;
  size: number;

  meteorId: number;
};

export type Meteor = {
  id: number;

  x: number;
  y: number;

  vx: number;
  vy: number;

  ax: number;
  ay: number;

  color: string;
};