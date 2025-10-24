import {
  textNextWeight,
  textLeftWeight,
  textLeftTorque,
  textTiltAngle,
  textRightTorque,
  textRightWeight,
  objectContainer,
  logSection,
} from "./elements.js";

function updateText(element, value) {
  element.textContent = value;
}

function updateSeesaw(tiltAngle) {
  seesaw.style.transform = `translateX(-50%) rotate(${tiltAngle}deg)`;
}

export function updateNextWeight(value) {
  updateText(textNextWeight, `${value}.0 kg`);
}

export function updateLeftWeight(value) {
  updateText(textLeftWeight, `${value}.0 kg`);
}

export function updateLeftTorque(value) {
  updateText(textLeftTorque, `${value}.0 Nm`);
}

export function updateTiltAngle(value) {
  updateText(textTiltAngle, `${value}°`);
}

export function updateRightTorque(value) {
  updateText(textRightTorque, `${value}.0 Nm`);
}

export function updateRightWeight(value) {
  updateText(textRightWeight, `${value}.0 kg`);
}

export function resetAll() {
  updateSeesaw(0);

  updateLeftWeight(0);
  updateLeftTorque(0);
  updateTiltAngle(0);
  updateRightTorque(0);
  updateRightWeight(0);

  objectContainer.innerHTML = "";
  logSection.innerHTML = "";
}

export function createObject(weight, position, color, initialPosition) {
  let object = document.createElement("div");
  object.classList.add("object");
  object.style.width = `${45 + (weight - 1) * 3}px`;
  object.style.height = `${45 + (weight - 1) * 3}px`;
  object.textContent = `${weight} kg`;
  object.style.backgroundColor = color;
  object.dataset.position = position;

  if (initialPosition) {
    object.style.top = `${initialPosition[1] - 150}px`;
    object.style.left = `${initialPosition[0] - 200}px`;
  }

  objectContainer.append(object);
}

export function log(weight, direction, distance) {
  let log = document.createElement("div");
  log.classList.add("initial");
  log.textContent = `${weight}.0 kg was dropped on the ${
    direction ? "left" : "right"
  } side at ${distance}.0 cm (${distance}px) from the pivot.`;

  logSection.insertBefore(log, logSection.firstElementChild);
  setTimeout(() => log.classList.remove("initial"), 4);
}
