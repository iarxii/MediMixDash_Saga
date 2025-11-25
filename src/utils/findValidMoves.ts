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

// Smart rearrangement algorithm for consultants - finds optimal tile rearrangements
export const findSmartRearrangements = (board: string[], boardSize: number): { fromIndex: number; toIndex: number; value: number }[] => {
  const rearrangements: { fromIndex: number; toIndex: number; value: number }[] = [];

  const isValidPosition = (row: number, col: number): boolean => {
    return row >= 0 && row < boardSize && col >= 0 && col < boardSize;
  };

  const getDistance = (index1: number, index2: number): number => {
    const row1 = Math.floor(index1 / boardSize);
    const col1 = index1 % boardSize;
    const row2 = Math.floor(index2 / boardSize);
    const col2 = index2 % boardSize;
    return Math.abs(row1 - row2) + Math.abs(col1 - col2);
  };

  const evaluateBoardAfterSwap = (boardCopy: string[]): number => {
    let score = 0;

    // Count potential matches after swap
    for (let row = 0; row < boardSize; row++) {
      for (let col = 0; col < boardSize; col++) {
        const color = boardCopy[row * boardSize + col];
        if (!color) continue;

        // Check horizontal potential
        let horizontalCount = 1;
        for (let i = col - 1; i >= 0 && boardCopy[row * boardSize + i] === color; i--) horizontalCount++;
        for (let i = col + 1; i < boardSize && boardCopy[row * boardSize + i] === color; i++) horizontalCount++;
        if (horizontalCount >= 3) score += horizontalCount * 10;

        // Check vertical potential
        let verticalCount = 1;
        for (let i = row - 1; i >= 0 && boardCopy[i * boardSize + col] === color; i--) verticalCount++;
        for (let i = row + 1; i < boardSize && boardCopy[i * boardSize + col] === color; i++) verticalCount++;
        if (verticalCount >= 3) score += verticalCount * 10;
      }
    }

    return score;
  };

  // Find clusters of similar tiles within radius 2
  const findClusters = (): { color: string; positions: number[] }[] => {
    const clusters: { color: string; positions: number[] }[] = [];
    const visited = new Set<number>();

    for (let i = 0; i < board.length; i++) {
      if (visited.has(i) || !board[i]) continue;

      const color = board[i];
      const clusterPositions: number[] = [];
      const queue = [i];
      const clusterVisited = new Set<number>();

      // BFS to find connected tiles of same color within radius 2
      while (queue.length > 0) {
        const current = queue.shift()!;
        if (clusterVisited.has(current)) continue;
        clusterVisited.add(current);

        const currentRow = Math.floor(current / boardSize);
        const currentCol = current % boardSize;

        // Check all tiles within radius 2
        for (let dr = -2; dr <= 2; dr++) {
          for (let dc = -2; dc <= 2; dc++) {
            const newRow = currentRow + dr;
            const newCol = currentCol + dc;
            if (isValidPosition(newRow, newCol)) {
              const newIndex = newRow * boardSize + newCol;
              if (!clusterVisited.has(newIndex) && board[newIndex] === color && Math.abs(dr) + Math.abs(dc) <= 2) {
                clusterPositions.push(newIndex);
                queue.push(newIndex);
                clusterVisited.add(newIndex);
              }
            }
          }
        }
      }

      if (clusterPositions.length >= 2) {
        clusters.push({ color, positions: clusterPositions });
        clusterPositions.forEach(pos => visited.add(pos));
      }
    }

    return clusters;
  };

  const clusters = findClusters();

  // For each cluster, find optimal rearrangements
  for (const cluster of clusters) {
    const { positions } = cluster;

    // Try different swap combinations within the cluster
    for (let i = 0; i < positions.length; i++) {
      for (let j = i + 1; j < positions.length; j++) {
        const pos1 = positions[i];
        const pos2 = positions[j];

        // Only consider swaps within reasonable distance
        if (getDistance(pos1, pos2) <= 3) {
          const boardCopy = [...board];
          [boardCopy[pos1], boardCopy[pos2]] = [boardCopy[pos2], boardCopy[pos1]];

          const score = evaluateBoardAfterSwap(boardCopy);
          if (score > 0) {
            rearrangements.push({
              fromIndex: pos1,
              toIndex: pos2,
              value: score
            });
          }
        }
      }
    }
  }

  // Sort by value (highest potential first) and return top rearrangements
  return rearrangements
    .sort((a, b) => b.value - a.value)
    .slice(0, 5); // Return top 5 best rearrangements
};