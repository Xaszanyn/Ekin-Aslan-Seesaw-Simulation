import {
  resetButton,
  seesaw,
  objectContainer,
  interactionLayer,
  previewObject,
  logSection,
} from "./js/elements.js";

import {
  updateNextWeight,
  updateLeftWeight,
  updateLeftTorque,
  updateTiltAngle,
  updateRightTorque,
  updateRightWeight,
  resetStats,
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

  seesaw.style.transform = `translateX(-50%) rotate(${state.tiltAngle}deg)`;
  updateTiltAngle(state.tiltAngle);

  state.left.map((object) =>
    createSeesawObject(object[0], object[1], object[2])
  );

  state.right.map((object) =>
    createSeesawObject(object[0], -object[1], object[2])
  );

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
  createSeesawObject(
    previewWeight,
    200 - previewPosition[0],
    previewObject.style.backgroundColor,
    previewPosition
  );
  addLog(
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
  seesaw.style.transform = `translateX(-50%) rotate(${state.tiltAngle}deg)`;
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

  resetStats();

  seesaw.style.transform = `translateX(-50%) rotate(0deg)`;

  localStorage.removeItem("seesaw");

  objectContainer.innerHTML = "";
  logSection.innerHTML = "";
});

function createSeesawObject(weight, position, color, initialPosition) {
  let object = document.createElement("div");
  object.classList.add("object");
  object.style.width = `${45 + (weight - 1) * 3}px`;
  object.style.height = `${45 + (weight - 1) * 3}px`;
  object.textContent = `${weight} kg`;
  object.style.backgroundColor = color;
  if (initialPosition) {
    object.style.top = `${initialPosition[1] - 150}px`;
    object.style.left = `${initialPosition[0] - 200}px`;
  }
  object.dataset.position = position;

  objectContainer.append(object);
}

function addLog(weight, direction, distance) {
  let newLog = document.createElement("div");
  newLog.classList.add("initial");
  newLog.textContent = `${weight}.0 kg was dropped on the ${
    direction ? "left" : "right"
  } side at ${distance}.0 cm (${distance}px) from the pivot.`;
  logSection.insertBefore(newLog, logSection.firstElementChild);
  setTimeout(() => newLog.classList.remove("initial"), 4);
}
