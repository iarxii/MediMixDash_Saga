export const findValidMoves = (board: string[], boardSize: number): number[] => {
  const validMoves: number[] = [];

  const isValidPosition = (row: number, col: number): boolean => {
    return row >= 0 && row < boardSize && col >= 0 && col < boardSize;
  };

  const checkMatch = (boardCopy: string[], row: number, col: number): boolean => {
    const color = boardCopy[row * boardSize + col];

    // Check horizontal
    let count = 1;
    for (let i = col - 1; i >= 0 && boardCopy[row * boardSize + i] === color; i--) count++;
    for (let i = col + 1; i < boardSize && boardCopy[row * boardSize + i] === color; i++) count++;
    if (count >= 3) return true;

    // Check vertical
    count = 1;
    for (let i = row - 1; i >= 0 && boardCopy[i * boardSize + col] === color; i--) count++;
    for (let i = row + 1; i < boardSize && boardCopy[i * boardSize + col] === color; i++) count++;
    if (count >= 3) return true;

    return false;
  };

  // Check all possible swaps
  for (let row = 0; row < boardSize; row++) {
    for (let col = 0; col < boardSize; col++) {
      const index = row * boardSize + col;

      // Check right swap
      if (isValidPosition(row, col + 1)) {
        const boardCopy = [...board];
        [boardCopy[index], boardCopy[index + 1]] = [boardCopy[index + 1], boardCopy[index]];
        if (checkMatch(boardCopy, row, col) || checkMatch(boardCopy, row, col + 1)) {
          validMoves.push(index, index + 1);
        }
      }

      // Check down swap
      if (isValidPosition(row + 1, col)) {
        const boardCopy = [...board];
        [boardCopy[index], boardCopy[index + boardSize]] = [boardCopy[index + boardSize], boardCopy[index]];
        if (checkMatch(boardCopy, row, col) || checkMatch(boardCopy, row + 1, col)) {
          validMoves.push(index, index + boardSize);
        }
      }
    }
  }

  // Remove duplicates
  return Array.from(new Set(validMoves));
};