const item = "seesaw-ekin"; //* To avoid mixing with other local projects.
const themeItem = "seesaw-theme-ekin";

function createInitialState() {
  return {
    objects: [], //* [[weight, distance, color]]
    tiltAngle: 0,
    nextWeight: Math.ceil(Math.random() * 10),
    previewWeight: Math.ceil(Math.random() * 10),
    previewPosition: [], //* [x, y]
    color: `hsl(${Math.ceil(Math.random() * 360)} 100% 70%)`,
  };
}

export function loadState() {
  return JSON.parse(localStorage.getItem(item)) ?? createInitialState();
}

export function saveState(state) {
  localStorage.setItem(item, JSON.stringify(state));
}

export function resetState() {
  localStorage.removeItem(item);
  return createInitialState();
}

export function loadTheme() {
  return localStorage.getItem(themeItem) ?? "blue";
}

export function saveTheme(theme) {
  localStorage.setItem(themeItem, theme);
}
