import { medications } from "./candyData";

export const createBoard = (baordSize: number = 8) =>
  Array(baordSize * baordSize)
    .fill(null)
    .map(() => medications[Math.floor(Math.random() * medications.length)]);
