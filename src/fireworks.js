import Vector from "./Vector2D.js";

const colors = [
  "#b3312c",
  "#eb8844",
  "#decf2a",
  "#41cd34",
  "#3b511a",
  "#6689d3",
  "#287697",
  "#253192",
  "#7b2fbe",
  "#c354cd",
  "#d88198",
  "#f0f0f0",
  "#ababab",
  "#434343",
  "#1e1b1b",
  "#51301a",
];

const GRAVITY = new Vector(0, -0.981);
function* trackObjectPosition(properties) {
  const acceleration = properties.initialAcceleration.clone();
  const velocity = properties.initialVelocity.clone();
  const position = properties.initialPosition.clone();
  yield position;
  for (let i = 0; i < properties.lifeExpectancy; i++) {
    const thrust =
      i < properties.fuelAutonomy
        ? velocity
            .clone()
            .normalize()
            .multiply(properties.motorThrust * (1 - Math.exp(-i)))
        : Vector.NUL;
    const friction = velocity.clone().multiply(-properties.frictionCoefficient);
    acceleration.add(GRAVITY, thrust, friction);
    velocity.add(acceleration);
    position.add(velocity);
    yield position;
  }
  return { position, velocity, acceleration };
}

async function drawTrajectory(ctx, ballisticObject) {
  return new Promise((resolve) => {
    const getPosition = trackObjectPosition(ballisticObject);

    let previousTimestamp;
    function nextFrame(timestamp) {
      for (let i = previousTimestamp || timestamp; i < timestamp; i++) {
        const { value: position, done } = getPosition.next();
        if (done) return resolve(position);
        ctx.fillStyle = ballisticObject.color;
        ctx.beginPath();
        ctx.rect(
          position.x >> 20,
          position.y >> 20,
          ballisticObject.thickness,
          1
        );
        ctx.fill();
      }
      requestAnimationFrame(nextFrame);
      previousTimestamp = timestamp;
    }
    requestAnimationFrame(nextFrame);
  });
}

function spiderEffect({ position: initialPosition, velocity }, color) {
  return {
    initialPosition,
    initialVelocity: new Vector(0, velocity.y),
    initialAcceleration: new Vector(
      (Math.random() - 0.5) * 2000,
      -GRAVITY.y * 1000
    ),
    lifeExpectancy: 800,
    fuelAutonomy: 0,
    motorThrust: 0,
    frictionCoefficient: Math.random() * 0.000015 + 0.000005,
    thickness: 3,
    color,
  };
}

export function launchRocket(
  ctx,
  initialPosition = Vector.NUL,
  color = undefined
) {
  const skyRocket = {
    initialPosition,
    initialVelocity: Vector.NUL,
    initialAcceleration: new Vector(
      ((Math.random() + 1.5) % 2) - 1, // [-1, -.5]U[.5, 1]
      GRAVITY.y * -7
    ),
    lifeExpectancy: 900 + Math.random() * 300,
    fuelAutonomy: 600,
    motorThrust: GRAVITY.y * -5,
    frictionCoefficient: Math.random() * 0.000015 + 0.000005,
    thickness: 7,
    color: color || colors[(Math.random() * colors.length) | 0],
  };

  return drawTrajectory(ctx, skyRocket)
    .then((previousState) =>
      Promise.all(
        Array.from({ length: Math.random() * 10 }, () =>
          drawTrajectory(ctx, spiderEffect(previousState, skyRocket.color))
        )
      )
    )
    .catch(console.error);
}

/**
 * @param {HTMLCanvasElement} canvas
 * @param {Promise<>} promiseToWaitFor Promise that resolves when it's time to
 *                                     fade out the canvas (usually a
 *                                     `Promise.all` to wait for all
 *                                     `launchRocket` animations to complete.
 * @param {CanvasRenderingContext2D} ctx
 * @returns {FrameRequestCallback} Frame by frame callback that erases previous
 *                                 traces.
 */
export function fadeOutChemTrails(canvas, promiseToWaitFor, ctx = null) {
  const { width, height } = canvas;

  if (ctx == null) {
    ctx = canvas.getContext("2d");
  }

  let previousTimestamp, animationFrameID;
  function nextFrame(timestamp) {
    const frame = ctx.getImageData(0, 0, width, height);
    const speed = (timestamp - previousTimestamp) / 16;
    for (let i = 3; i < frame.data.length; i += 4) {
      const val = frame.data[i];
      if (val > 16) {
        frame.data[i] = val - (val >> 3) * speed;
      }
    }
    ctx.putImageData(frame, 0, 0);

    animationFrameID = requestAnimationFrame(nextFrame);
    previousTimestamp = timestamp;
  }

  promiseToWaitFor.then(() => {
    canvas.addEventListener("transitionend", () => {
      cancelAnimationFrame(animationFrameID);
      canvas.remove();
    });
    canvas.style.transformOrigin = "top";
    canvas.style.transition = "all 3s ease-in";
    canvas.style.transitionProperty = "opacity,transform";
    canvas.style.opacity = 0;
    canvas.style.transform = "scaleY(1.5)";
  });

  return nextFrame;
}

const delay = (delay) => new Promise((done) => setTimeout(done, delay));

/**
 * @param {number} numberOfRockets
 * @param {number} delayBetweenRockets in milliseconds
 * @param {number} scale Canvas default size is 1000x1000 px²
 * @returns {HTMLCanvasElement}
 */
export default function autoShow(
  numberOfRockets = 5,
  delayBetweenRockets = 200,
  scale = 1
) {
  const WIDTH = 1000 * scale;
  const HEIGHT = 1000 * scale;
  const canvas = document.createElement("canvas");
  canvas.height = HEIGHT;
  canvas.width = WIDTH;
  const ctx = canvas.getContext("2d");
  ctx.setTransform(scale, 0, 0, -scale, WIDTH / 2, HEIGHT);
  requestAnimationFrame(
    fadeOutChemTrails(
      canvas,
      Promise.all(
        Array.from({ length: numberOfRockets }, (_, i) =>
          delay(Math.random() * 50 + i * delayBetweenRockets).then(() =>
            launchRocket(ctx)
          )
        )
      ),
      ctx
    )
  );

  return canvas;
}
