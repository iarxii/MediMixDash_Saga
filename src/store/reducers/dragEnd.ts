import { WritableDraft } from "immer/dist/types/types-external";
import {
  formulaForColumnOfFour,
  formulaForColumnOfThree,
  generateInvalidMoves,
} from "../../utils/formulas";
import {
  checkForColumnOfThree,
  checkForRowOfFour,
  checkForRowOfThree,
  isColumnOfFour,
} from "../../utils/moveCheckLogic";

export const dragEndReducer = (
  state: WritableDraft<{
    board: string[];
    boardSize: number;
    squareBeingReplaced: Element | undefined;
    squareBeingDragged: Element | undefined;
    dispensed: { [med: string]: number };
  }>
) => {
  const newBoard = [...state.board];
  let { boardSize, squareBeingDragged, squareBeingReplaced } = state;
  const squareBeingDraggedId: number = parseInt(
    squareBeingDragged?.getAttribute("candy-id") as string
  );
  const squareBeingReplacedId: number = parseInt(
    squareBeingReplaced?.getAttribute("candy-id") as string
  );

  newBoard[squareBeingReplacedId] = state.board[squareBeingDraggedId];
  newBoard[squareBeingDraggedId] = state.board[squareBeingReplacedId];

  const validMoves: number[] = [
    squareBeingDraggedId - 1,
    squareBeingDraggedId - boardSize,
    squareBeingDraggedId + 1,
    squareBeingDraggedId + boardSize,
  ];

  const validMove: boolean = validMoves.includes(squareBeingReplacedId);

  const isAColumnOfFour: number[] = isColumnOfFour(
    newBoard,
    boardSize,
    formulaForColumnOfFour(boardSize)
  );

  const isARowOfFour: number[] = checkForRowOfFour(
    newBoard,
    boardSize,
    generateInvalidMoves(boardSize, true)
  );

  const isAColumnOfThree: number[] = checkForColumnOfThree(
    newBoard,
    boardSize,
    formulaForColumnOfThree(boardSize)
  );

  const isARowOfThree: number[] = checkForRowOfThree(
    newBoard,
    boardSize,
    generateInvalidMoves(boardSize)
  );

  const allRemoved = [...isAColumnOfFour, ...isARowOfFour, ...isAColumnOfThree, ...isARowOfThree];

  if (
    squareBeingReplacedId &&
    validMove &&
    allRemoved.length > 0
  ) {
    // Count dispensed meds
    const dispensed: { [med: string]: number } = {};
    allRemoved.forEach(pos => {
      const med = state.board[pos];
      dispensed[med] = (dispensed[med] || 0) + 1;
    });
    state.dispensed = dispensed;
    // Remove
    allRemoved.forEach(pos => newBoard[pos] = "");
    squareBeingDragged = undefined;
    squareBeingReplaced = undefined;
  } else {
    newBoard[squareBeingReplacedId] = state.board[squareBeingReplacedId];
    newBoard[squareBeingDraggedId] = state.board[squareBeingDraggedId];
  }
  state.board = newBoard;
};
