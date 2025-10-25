const whoosh = new Audio("../sounds/whoosh.mp3");
const keyPress = new Audio("../sounds/key-press.mp3");
//* cloneNode for overlapping sounds.

whoosh.onerror = () => {
  if (whoosh.src == "./sounds/whoosh.mp3") return;

  whoosh.src = "./sounds/whoosh.mp3";
  whoosh.load();
};
keyPress.onerror = () => {
  if (keyPress.src == "./sounds/key-press.mp3") return;

  keyPress.src = "./sounds/key-press.mp3";
  keyPress.load();
};

export function playWhoosh(value) {
  let sound = whoosh.cloneNode();
  sound.volume = 0.5 * (value / 60);
  sound.play();
}

const majorSemitones = [0, 2, 4, 5, 7, 9, 11, 12];
let index = 0;
export function playPop() {
  let audioContext = new AudioContext();
  let bufferSource = audioContext.createBufferSource();
  let gainNode = audioContext.createGain();
  gainNode.gain.value = 0.2;
  gainNode.connect(audioContext.destination);

  fetch("../sounds/pop.mp3")
    .then((response) => {
      if (response.ok) return response;
      throw new Error("404 Not Found");
    })
    .catch(() => fetch("./sounds/pop.mp3"))
    .then((response) => response.arrayBuffer())
    .then((arrayBuffer) => audioContext.decodeAudioData(arrayBuffer))
    .then((audioBuffer) => {
      bufferSource.buffer = audioBuffer;
      bufferSource.connect(gainNode);

      bufferSource.playbackRate.value =
        Math.pow(2, majorSemitones[index++] / 12) * 0.9;
      index %= 8;

      bufferSource.start();
    });
}

export function playKeyPress() {
  let sound = keyPress.cloneNode();
  sound.volume = 0.2;
  sound.play();
}
