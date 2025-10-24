import {
  resetButton,
  objectContainer,
  interactionLayer,
  previewObject,
} from "./js/elements.js";

import {
  updateSeesaw,
  updateNextWeight,
  updateLeftWeight,
  updateLeftTorque,
  updateTiltAngle,
  updateRightTorque,
  updateRightWeight,
  resetAll,
  createObject,
  log,
} from "./js/ui.js";

//TODO merge left & right, format state

var state = JSON.parse(localStorage.getItem("seesaw")) ?? {
  left: [],
  right: [],
  tiltAngle: 0,
};

function initialize() {
  //TODO remove recalculation

  if (!state.left.length && !state.right.length) return;

  updateLeftWeight(
    state.left.reduce((weight, object) => weight + object[0], 0)
  );
  updateRightWeight(
    state.right.reduce((weight, object) => weight + object[0], 0)
  );

  let leftTorque = state.left.reduce(
    (torque, object) => torque + object[0] * object[1],
    0
  );
  let rightTorque = state.right.reduce(
    (torque, object) => torque + object[0] * object[1],
    0
  );
  updateLeftTorque(leftTorque);
  updateRightTorque(rightTorque);

  updateSeesaw(state.tiltAngle);
  updateTiltAngle(state.tiltAngle);

  state.left.map((object) => createObject(object[0], object[1], object[2]));

  state.right.map((object) => createObject(object[0], -object[1], object[2]));

  calculateObjectsPosition();
}

initialize();

var nextWeight = Math.ceil(Math.random() * 10);
var previewWeight;
var previewPosition;

function setNextObject() {
  previewObject.style.width = `${45 + (nextWeight - 1) * 3}px`;
  previewObject.style.height = `${45 + (nextWeight - 1) * 3}px`;
  previewObject.style.backgroundColor = `hsl(${Math.ceil(
    Math.random() * 360
  )} 100% 70%)`;
  previewObject.textContent = `${nextWeight} kg`;
  previewWeight = nextWeight;
  nextWeight = Math.ceil(Math.random() * 10);
  updateNextWeight(nextWeight);
}

function addObject(weight, distance, direction, color) {
  state[direction ? "left" : "right"].push([weight, distance, color]);
  localStorage.setItem("seesaw", JSON.stringify(state));
}

interactionLayer.addEventListener("mousemove", ({ offsetX, offsetY }) => {
  previewObject.style.display = "flex";
  offsetX = Math.min(400, Math.max(0, offsetX));
  previewPosition = [offsetX, offsetY];
  previewObject.style.top = `${offsetY}px`;
  previewObject.style.left = `${offsetX}px`;
});

interactionLayer.addEventListener(
  "mouseleave",
  () => (previewObject.style.display = "none")
);

interactionLayer.addEventListener("click", () => {
  addObject(
    previewWeight,
    Math.abs(200 - previewPosition[0]),
    previewPosition[0] <= 200,
    previewObject.style.backgroundColor
  );
  createObject(
    previewWeight,
    200 - previewPosition[0],
    previewObject.style.backgroundColor,
    previewPosition
  );
  log(
    previewWeight,
    previewPosition[0] <= 200,
    Math.abs(200 - previewPosition[0])
  );
  calculateTiltAngle();
  calculateObjectsPosition();
  setNextObject();
});

setNextObject();

function calculateTiltAngle() {
  if (!state.left.length && !state.right.length) return;

  updateLeftWeight(
    state.left.reduce((weight, object) => weight + object[0], 0)
  );

  updateRightWeight(
    state.right.reduce((weight, object) => weight + object[0], 0)
  );

  let leftTorque = state.left.reduce(
    (torque, object) => torque + object[0] * object[1],
    0
  );
  let rightTorque = state.right.reduce(
    (torque, object) => torque + object[0] * object[1],
    0
  );
  updateLeftTorque(leftTorque);
  updateRightTorque(rightTorque);

  //! Hyperbolic tangent for practicality, for now.
  state.tiltAngle =
    Math.round(Math.tanh(Math.log(rightTorque / leftTorque)) * 30 * 100) / 100;
  updateSeesaw(state.tiltAngle);
  updateTiltAngle(state.tiltAngle);
  localStorage.setItem("seesaw", JSON.stringify(state));
}

function calculateObjectsPosition() {
  setTimeout(
    () =>
      [...objectContainer.children].map((object) => {
        object.style.top = `${
          Math.sin((-state.tiltAngle * Math.PI) / 180) * object.dataset.position
        }px`;
        object.style.left = `${
          -Math.cos((-state.tiltAngle * Math.PI) / 180) *
          object.dataset.position
        }px`;
      }),
    4
  );
}

resetButton.addEventListener("click", () => {
  state = {
    left: [],
    right: [],
    tiltAngle: 0,
  };

  resetAll();

  localStorage.removeItem("seesaw");
});
