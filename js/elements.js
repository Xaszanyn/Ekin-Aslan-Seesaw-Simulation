const resetButton = document.querySelector("#reset-button");
const seesaw = document.querySelector("#seesaw");
const objectContainer = document.querySelector("#object-container");
const interactionLayer = document.querySelector("#interaction-layer");
const previewObject = document.querySelector("#preview-object");
const logSection = document.querySelector("#log-section");

const [
  textNextWeight,
  textLeftWeight,
  textLeftTorque,
  textTiltAngle,
  textRightTorque,
  textRightWeight,
] = document.querySelectorAll(".text");

const [redThemeButton, greenThemeButton, blueThemeButton] =
  document.querySelectorAll("#theme-section button");

export {
  resetButton,
  seesaw,
  objectContainer,
  interactionLayer,
  previewObject,
  logSection,
  textNextWeight,
  textLeftWeight,
  textLeftTorque,
  textTiltAngle,
  textRightTorque,
  textRightWeight,
  redThemeButton,
  greenThemeButton,
  blueThemeButton,
};
