// Edit copy and camera framing here — the animation code reads this array.
// progress: where along the pinned scroll (0–1) this stage's camera lands.
// cameraPosition / target: world-space [x, y, z]; camera eases between
// consecutive stages as the user scrolls.
const shirtScrollStages = [
  {
    progress: 0,
    cameraPosition: [0, 0.1, 5.2],
    target: [0, 0, 0],
    title: "Boxy oversized cut",
    body: "Dropped shoulders, wide body, cropped just enough. Cut to hang, not cling.",
  },
  {
    progress: 0.5,
    cameraPosition: [0, 0.25, 2.0],
    target: [0, 0.25, 0],
    title: "Screen printed, not DTG",
    body: "Thick plastisol ink laid by hand. Prints that crack with age, not wash out.",
  },
  {
    progress: 1,
    cameraPosition: [0.7, -0.35, 1.1],
    target: [0.1, -0.3, 0],
    title: "240gsm heavyweight cotton",
    body: "Dense, structured, zero see-through. The fabric does half the talking.",
  },
];

export default shirtScrollStages;
