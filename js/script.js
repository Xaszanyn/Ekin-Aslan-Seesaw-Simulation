import {
  resetButton,
  objectContainer,
  interactionLayer,
  previewObject,
} from "./elements.js";

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
  updateObject,
  log,
  updatePreviewObject,
  movePreviewObject,
} from "./ui.js";

import { loadState, saveState, resetState } from "./storage.js";

var state = loadState(); //* { objects, tiltAngle, nextWeight, previewWeight, previewPosition }

function previewNextObject() {
  state.color = `hsl(${Math.ceil(Math.random() * 360)} 100% 70%)`;
  //TODO Themed Colors
  updatePreviewObject(state.nextWeight, state.color);
  state.previewWeight = state.nextWeight;

  state.nextWeight = Math.ceil(Math.random() * 10);
  updateNextWeight(state.nextWeight);
}

(function initialize() {
  state.objects.map((object) => {
    createObject(object[0], [object[1], 150], object[2]); //* 150 is initial y value.
    log(object[0], object[1]);
  });

  calculateTiltAngle();
  calculateObjectsPosition();

  previewNextObject();
})();

interactionLayer.addEventListener("mousemove", ({ offsetX, offsetY }) => {
  offsetX = Math.min(400, Math.max(0, offsetX));
  state.previewPosition = [offsetX, offsetY];
  movePreviewObject(offsetX, offsetY, state.previewWeight, state.tiltAngle);
});

interactionLayer.addEventListener(
  "mouseleave",
  () => (previewObject.style.display = "none")
);

interactionLayer.addEventListener("click", () => {
  state.objects.push([
    state.previewWeight,
    state.previewPosition[0],
    state.color,
  ]);

  saveState(state);

  createObject(state.previewWeight, state.previewPosition, state.color);

  log(state.previewWeight, state.previewPosition[0]);

  calculateTiltAngle();
  calculateObjectsPosition();

  previewNextObject();
});

function calculateTiltAngle() {
  if (!state.objects.length) return;

  let [leftWeight, leftTorque, rightWeight, rightTorque] = state.objects.reduce(
    (stats, object) => {
      stats[object[1] <= 200 ? 0 : 2] += object[0];
      stats[object[1] <= 200 ? 1 : 3] += object[0] * Math.abs(200 - object[1]);

      return stats;
    },
    [0, 0, 0, 0]
  );

  updateLeftWeight(leftWeight);
  updateLeftTorque(leftTorque);
  updateRightTorque(rightTorque);
  updateRightWeight(rightWeight);

  //! Hyperbolic tangent for practicality, for now.
  state.tiltAngle =
    Math.round(Math.tanh(Math.log(rightTorque / leftTorque)) * 30 * 100) / 100;

  updateSeesaw(state.tiltAngle);
  updateTiltAngle(state.tiltAngle);

  saveState(state);
}

function calculateObjectsPosition() {
  let top, left;

  [...objectContainer.children].map((object) => {
    top =
      Math.sin((-state.tiltAngle * Math.PI) / 180) *
      (200 - object.dataset.distance);
    left =
      -Math.cos((-state.tiltAngle * Math.PI) / 180) *
      (200 - object.dataset.distance);

    updateObject(object, top, left);
  });
}

resetButton.addEventListener("click", () => {
  state = resetState();
  resetAll();
});
