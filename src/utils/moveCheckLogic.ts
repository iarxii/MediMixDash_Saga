export const isColumnOfFour = (
  newBoard: string[],
  boardSize: number,
  formulaForColumnOfFour: number
): number[] => {
  for (let i: number = 0; i <= formulaForColumnOfFour; i++) {
    const columnOfFour: number[] = [
      i,
      i + boardSize,
      i + boardSize * 2,
      i + boardSize * 3,
    ];
    const decidedColor: string = newBoard[i];

    const isBlank: boolean = newBoard[i] === "";

    if (
      columnOfFour.every(
        (square: number) => newBoard[square] === decidedColor && !isBlank
      )
    ) {
      return columnOfFour;
    }
  }
  return [];
};

export const checkForRowOfFour = (
  newBoard: String[],
  boardSize: number,
  invalidMovesForColumnOfFour: number[]
): number[] => {
  for (let i = 0; i < boardSize * boardSize; i++) {
    const rowOfFour = [i, i + 1, i + 2, i + 3];
    const decidedColor = newBoard[i];

    const isBlank = newBoard[i] === "";

    if (invalidMovesForColumnOfFour.includes(i)) continue;
    if (
      rowOfFour.every((square) => newBoard[square] === decidedColor && !isBlank)
    ) {
      return rowOfFour;
    }
  }
  return [];
};

export const checkForColumnOfThree = (
  newBoard: String[],
  boardSize: number,
  formulaForColumnOfThree: number
): number[] => {
  for (let i = 0; i <= formulaForColumnOfThree; i++) {
    const columnOfThree = [i, i + boardSize, i + boardSize * 2];
    const decidedColor = newBoard[i];
    const isBlank = newBoard[i] === "";

    if (
      columnOfThree.every(
        (square) => newBoard[square] === decidedColor && !isBlank
      )
    ) {
      return columnOfThree;
    }
  }
  return [];
};

export const checkForRowOfThree = (
  newBoard: string[],
  boardSize: number,
  invalidMovesForColumnOfThree: number[]
): number[] => {
  for (let i = 0; i < boardSize * boardSize; i++) {
    const rowOfThree = [i, i + 1, i + 2];
    const decidedColor = newBoard[i];

    const isBlank = newBoard[i] === "";

    if (invalidMovesForColumnOfThree.includes(i)) continue;

    if (
      rowOfThree.every(
        (square) => newBoard[square] === decidedColor && !isBlank
      )
    ) {
      return rowOfThree;
    }
  }
  return [];
};
