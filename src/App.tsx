import { useEffect } from "react";
import BackgroundCarousel from "./components/BackgroundCarousel";
import Board from "./components/Board";
import Patients from "./components/Patients";
import { moveBelow, updateBoard, resetDispensed } from "./store";
import { useAppDispatch, useAppSelector } from "./store/hooks";
import { createBoard } from "./utils/createBoard";
import {
  formulaForColumnOfFour,
  formulaForColumnOfThree,
  generateInvalidMoves,
} from "./utils/formulas";
import {
  checkForColumnOfThree,
  checkForRowOfFour,
  checkForRowOfThree,
  isColumnOfFour,
} from "./utils/moveCheckLogic";
import { dispenseMed, setPatients, updateTimers } from "./store";

interface Patient {
  id: number;
  name: string;
  prescription: { [med: string]: number };
  dispensed: { [med: string]: number };
  waitTime: number;
  maxWaitTime: number;
  status: 'waiting' | 'dispensing' | 'completed' | 'failed';
}

function App() {
  const dispatch = useAppDispatch();
  const board = useAppSelector(({ candyCrush: { board } }) => board);
  const dispensed = useAppSelector(({ candyCrush: { dispensed } }) => dispensed);
  const boardSize = useAppSelector(
    ({ candyCrush: { boardSize } }) => boardSize
  );

  useEffect(() => {
    dispatch(updateBoard(createBoard(boardSize)));
    // Initialize patients
    const initialPatients: Patient[] = [
      {
        id: 1,
        name: "Alice",
        prescription: { "Gelux": 5, "Pillora": 2, "Injecta": 1 },
        dispensed: { "Gelux": 0, "Pillora": 0, "Injecta": 0 },
        waitTime: 30,
        maxWaitTime: 30,
        status: 'waiting'
      },
      {
        id: 2,
        name: "Bob",
        prescription: { "Tablix": 3, "Syrupix": 4 },
        dispensed: { "Tablix": 0, "Syrupix": 0 },
        waitTime: 25,
        maxWaitTime: 25,
        status: 'waiting'
      },
      {
        id: 3,
        name: "Charlie",
        prescription: { "VitaDose": 2, "Capsulon": 1 },
        dispensed: { "VitaDose": 0, "Capsulon": 0 },
        waitTime: 20,
        maxWaitTime: 20,
        status: 'waiting'
      },
    ];
    dispatch(setPatients(initialPatients));
  }, [dispatch, boardSize]);

  useEffect(() => {
    if (Object.keys(dispensed).length > 0) {
      Object.entries(dispensed).forEach(([med, amount]) => {
        dispatch(dispenseMed({ med, amount }));
      });
      dispatch(resetDispensed());
    }
  }, [dispensed, dispatch]);

  useEffect(() => {
    const interval = setInterval(() => {
      dispatch(updateTimers());
    }, 1000);
    return () => clearInterval(interval);
  }, [dispatch]);

  useEffect(() => {
    const timeout = setTimeout(() => {
      const newBoard = [...board];
      isColumnOfFour(newBoard, boardSize, formulaForColumnOfFour(boardSize));
      checkForRowOfFour(
        newBoard,
        boardSize,
        generateInvalidMoves(boardSize, true)
      );
      checkForColumnOfThree(
        newBoard,
        boardSize,
        formulaForColumnOfThree(boardSize)
      );
      checkForRowOfThree(newBoard, boardSize, generateInvalidMoves(boardSize));
      dispatch(updateBoard(newBoard));
      dispatch(moveBelow());
    }, 150);
    return () => clearTimeout(timeout);
  }, [board, dispatch, boardSize]);

  return (
    <div className="h-screen">
      <BackgroundCarousel />
      <div className="grid grid-cols-1 md:grid-cols-3 h-full">
        <div className="md:col-span-1 p-4 bg-blue-100 bg-opacity-75 flex flex-col">
          {/* Seating Area */}
          <h2 className="text-2xl font-bold mb-4 text-blue-800">Waiting Patients</h2>
          <Patients />
        </div>
        <div className="md:col-span-2 p-4 flex items-center justify-center">
          {/* Pharmacy Block */}
          <Board />
        </div>
      </div>
    </div>
  );
}

export default App;
