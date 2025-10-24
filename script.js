const objectScreen = document.querySelector("#object-screen");
const preview = document.querySelector("#preview");
const nextWeightText = document.querySelector("#next-weight span");
const seesaw = document.querySelector("#seesaw");

var state = {
  left: [],
  right: [],
  tiltAngle: 0,
};

var nextWeight = Math.ceil(Math.random() * 10);
var previewWeight;
var previewPosition;

function setNextObject() {
  preview.style.width = `${45 + (nextWeight - 1) * 3}px`;
  preview.style.height = `${45 + (nextWeight - 1) * 3}px`;
  preview.style.backgroundColor = `hsl(${Math.ceil(
    Math.random() * 360
  )} 100% 70%)`;
  preview.textContent = `${nextWeight} kg`;
  previewWeight = nextWeight;
  nextWeight = Math.ceil(Math.random() * 10);
  nextWeightText.textContent = `${nextWeight}.0 kg`;
}

function addObject(weight, distance, direction) {
  state[direction ? "left" : "right"].push([weight, distance]);
  localStorage.setItem("seesaw", JSON.stringify(state));
}

objectScreen.addEventListener("mousemove", ({ offsetX, offsetY }) => {
  preview.style.display = "flex";
  offsetX = Math.min(400, Math.max(0, offsetX));
  previewPosition = [offsetX, offsetY];
  preview.style.top = `${offsetY}px`;
  preview.style.left = `${offsetX}px`;
});

objectScreen.addEventListener(
  "mouseleave",
  () => (preview.style.display = "none")
);

objectScreen.addEventListener("click", () => {
  addObject(
    previewWeight,
    Math.abs(200 - previewPosition[0]),
    previewPosition[0] <= 200
  );
  calculateTiltAngle();
  setNextObject();
});

setNextObject();

function calculateTiltAngle() {
  if (!state.left.length && !state.right.length) return;

  let torqueLeft = state.left.reduce(
    (torque, object) => torque + object[0] * object[1],
    0
  );
  let torqueRight = state.right.reduce(
    (torque, object) => torque + object[0] * object[1],
    0
  );

  //! Hyperbolic tangent for practicality, for now.
  state.tiltAngle =
    Math.round(Math.tanh(Math.log(torqueRight / torqueLeft)) * 30 * 100) / 100;
  seesaw.style.transform = `translateX(-50%) rotate(${state.tiltAngle}deg)`;

  console.log(state.tiltAngle);
}
