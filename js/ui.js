import {
  textNextWeight,
  textLeftWeight,
  textLeftTorque,
  textTiltAngle,
  textRightTorque,
  textRightWeight,
} from "./elements.js";

function updateText(element, value) {
  element.textContent = value;
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

export function resetStats() {
  updateLeftWeight(0);
  updateLeftTorque(0);
  updateTiltAngle(0);
  updateRightTorque(0);
  updateRightWeight(0);
}
