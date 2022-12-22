import { getRandomNumber } from "../utils/getRandomNumber";

export function getRandomSpaceColor() {
  const randomNum = getRandomNumber(1, 10) * 0.1;
  return spaceColors[Math.floor(randomNum * spaceColors.length - 1)];
}

export function getRandomTeamColor() {
  const randomNum = getRandomNumber(1, 10) * 0.1;
  return spaceColors[Math.floor(randomNum * teamColors.length - 1)];
}

export const spaceColors = [
  "rgb(62, 187, 133)",
  "rgb(26, 188, 156)",
  "rgb(39, 174, 96)",
  "rgb(0, 215, 23)",
  "rgb(243, 29, 47)",
  "rgb(236, 85, 92)",
  "rgb(252, 87, 94)",
  "rgb(252, 180, 16)",
  "rgb(177, 126, 34)",
  "rgb(242, 77, 22)",
  "rgb(255, 134, 0)",
  "rgb(236, 102, 37)",
  "rgb(41, 128, 185)",
  "rgb(52, 152, 219)",
  "rgb(82, 140, 203)",
  "rgb(9, 24, 236)",
  "rgb(25, 158, 199)",
  "rgb(3, 162, 253)",
  "rgb(123, 104, 238)",
  "rgb(191, 74, 204)",
  "rgb(7, 67, 84)",
  "rgb(52, 73, 94)",
  "rgb(24, 29, 33)",
];

export const teamColors = [
  "rgb(123, 104, 238)",
  "rgb(255, 161, 47)",
  "rgb(255, 87, 34)",
  "rgb(244, 44, 44)",
  "rgb(248, 48, 109)",
  "rgb(255, 0, 252)",
  "rgb(65, 105, 225)",
  "rgb(95, 129, 255)",
  "rgb(10, 180, 255)",
  "rgb(8, 199, 224)",
  "rgb(7, 160, 146)",
  "rgb(29, 185, 84)",
  "rgb(46, 165, 44)",
  "rgb(117, 115, 128)",
  "rgb(32, 32, 32)",
];

export const spaceColors2D = [
  [
    "rgb(62, 187, 133)",
    "rgb(26, 188, 156)",
    "rgb(39, 174, 96)",
    "rgb(0, 215, 23)",
    "rgb(243, 29, 47)",
    "rgb(236, 85, 92)",
    "rgb(252, 87, 94)",
    "rgb(252, 180, 16)",
    "rgb(177, 126, 34)",
    "rgb(242, 77, 22)",
    "rgb(255, 134, 0)",
  ],
  [
    "rgb(236, 102, 37)",
    "rgb(41, 128, 185)",
    "rgb(52, 152, 219)",
    "rgb(82, 140, 203)",
    "rgb(9, 24, 236)",
    "rgb(25, 158, 199)",
    "rgb(3, 162, 253)",
    "rgb(123, 104, 238)",
    "rgb(191, 74, 204)",
    "rgb(7, 67, 84)",
    "rgb(52, 73, 94)",
    "rgb(24, 29, 33)",
  ],
];

export const spaceColors3D = [
  [
    "rgb(62, 187, 133)",
    "rgb(26, 188, 156)",
    "rgb(39, 174, 96)",
    "rgb(0, 215, 23)",
    "rgb(243, 29, 47)",
    "rgb(236, 85, 92)",
    "rgb(252, 87, 94)",
    "rgb(252, 180, 16)",
  ],
  [
    "rgb(177, 126, 34)",
    "rgb(242, 77, 22)",
    "rgb(255, 134, 0)",
    "rgb(236, 102, 37)",
    "rgb(41, 128, 185)",
    "rgb(52, 152, 219)",
    "rgb(82, 140, 203)",
    "rgb(9, 24, 236)",
  ],
  [
    "rgb(25, 158, 199)",
    "rgb(3, 162, 253)",
    "rgb(123, 104, 238)",
    "rgb(191, 74, 204)",
    "rgb(7, 67, 84)",
    "rgb(52, 73, 94)",
    "rgb(24, 29, 33)",
    "",
  ],
];

export const teamColors2D = [
  [
    "rgb(123, 104, 238)",
    "rgb(255, 161, 47)",
    "rgb(255, 87, 34)",
    "rgb(244, 44, 44)",
    "rgb(248, 48, 109)",
    "rgb(255, 0, 252)",
  ],
  [
    "rgb(65, 105, 225)",
    "rgb(95, 129, 255)",
    "rgb(10, 180, 255)",
    "rgb(8, 199, 224)",
    "rgb(7, 160, 146)",
    "rgb(29, 185, 84)",
  ],
  ["rgb(46, 165, 44)", "rgb(117, 115, 128)", "rgb(32, 32, 32)"],
];
