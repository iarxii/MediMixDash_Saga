import { useEffect } from "react";
import BackgroundCarousel from "./components/BackgroundCarousel";
import Board from "./components/Board";
import Consultant from "./components/Consultant";
import Patients from "./components/Patients";
import { moveBelow, updateBoard, resetDispensed, updateTime, assignConsultantOrder, completeConsultantOrder } from "./store";
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
import { dispenseMed, setPatients, updateTimers, cleanupPatients, pinPatient, updatePatient } from "./store";
import { generatePatient } from "./utils/patientGenerator";

// images
import welcomeBanner from './assets/welcome-banner.png';

function App() {
  const dispatch = useAppDispatch();
  const board = useAppSelector(({ candyCrush: { board } }) => board);
  const dispensed = useAppSelector(({ candyCrush: { dispensed } }) => dispensed);
  const boardSize = useAppSelector(
    ({ candyCrush: { boardSize } }) => boardSize
  );
  const patients = useAppSelector((state) => state.patients);
  const game = useAppSelector((state) => state.game);

  useEffect(() => {
    dispatch(updateBoard(createBoard(boardSize)));
    // Initialize patients
    const initialPatients = [generatePatient(7 * 60 * 60), generatePatient(7 * 60 * 60), generatePatient(7 * 60 * 60)];
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
      dispatch(cleanupPatients(game.currentTime));
      dispatch(updateTime());
    }, 1000);
    return () => clearInterval(interval);
  }, [dispatch, game.currentTime]);

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
      <div className="grid grid-cols-1 md:grid-cols-12 h-full">
        {/* Patients Waiting Area / front-desk */}
        <div className="md:col-span-3 p-4 bg-blue-100 bg-opacity-75 flex flex-col min-h-0 max-h-screen overflow-y-auto">
          {/* Seating area */}
          <div className="flex flex-col h-full space-y-4">
            {/* Introduction banner */}
            <div className="bg-white p-2 rounded shadow">
              <img
                src={welcomeBanner}
                alt="Welcome Banner"
                className="w-full h-auto rounded"
              />
              {/* <h2 className="text-xl font-bold text-center text-blue-800">Welcome to MediMixDash Saga</h2>
              <p className="text-center text-sm text-gray-600">Manage your pharmacy efficiently and keep your patients happy!</p> */}
            </div>

            <div className="sticky top-0 z-10">
              {/* 1. Time/Clock - Shift Time */}
              <div className="bg-white p-2 rounded shadow mb-4">
                <h3 className="text-lg font-bold text-center">Current Time</h3>
                <p className="text-center text-xl">
                  {Math.floor(game.currentTime / 3600)}:
                  {Math.floor((game.currentTime % 3600) / 60).toString().padStart(2, "0")}:
                  {(game.currentTime % 60).toString().padStart(2, "0")}
                </p>
                {game.gameOver && <p className="text-center text-red-600 font-bold">Game Over!</p>}
              </div>

              {/* 2. Pharmacy Consultant Windows - 5 rows */}
              <div className="flex-1 bg-white p-2 rounded shadow overflow-y-auto min-h-[360px]">
                <h3 className="text-lg font-bold mb-2">Consultants</h3>
                <div className="space-y-2">
                  {game.consultants.map((consultant, i) => (
                    <Consultant key={consultant.id} consultant={consultant} index={i} />
                  ))}
                </div>
              </div>
            </div>

            {/* 3. Visual Seating Representation */}
            <div className="flex-1 bg-white p-2 rounded shadow max-h-[50vh]">
              <h3 className="text-lg font-bold mb-2">Seating Area</h3>
              <div className="grid grid-cols-1 gap-2 h-full overflow-y-auto">
                {patients.map((patient, index) => (
                  <div
                    key={patient.id}
                    className={`p-4 rounded-lg shadow cursor-pointer border-2 ${
                      patient.pinned ? "border-purple-500" : ""
                    } ${
                      patient.status === "completed"
                        ? "bg-green-100 border-green-500"
                        : patient.status === "failed"
                        ? "bg-red-100 border-red-500"
                        : patient.status === "dispensing"
                        ? "bg-yellow-100 border-yellow-500"
                        : "bg-blue-100 border-blue-300"
                    }`}
                    onClick={() => {
                      if (patient.status === 'waiting') {
                        // Find available consultant
                        const availableConsultant = game.consultants.find(c => c.available && c.status === 'available');
                        if (availableConsultant) {
                          dispatch(updatePatient({ id: patient.id, updates: { status: 'dispensing', assignedConsultant: availableConsultant.id } }));
                          dispatch(assignConsultantOrder({ consultantId: availableConsultant.id, patientId: patient.id }));
                        }
                      }
                      dispatch(pinPatient(patient.id));
                    }}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-lg font-bold text-gray-800">
                        {patient.name}
                      </span>
                      <span className="text-sm font-semibold bg-blue-100 px-2 py-1 rounded">
                        #{patient.ticketNumber}
                      </span>
                    </div>
                    <div className="flex items-center space-x-2 mb-2">
                      <span className="text-sm text-gray-600">
                        Age: {patient.age}
                      </span>
                      <span
                        className={`text-sm ${
                          patient.moodStatus === "calm"
                            ? "text-green-600"
                            : patient.moodStatus === "impatient"
                            ? "text-yellow-600"
                            : "text-red-600"
                        }`}
                      >
                        {patient.moodStatus === "calm"
                          ? "😊"
                          : patient.moodStatus === "impatient"
                          ? "😐"
                          : patient.moodStatus === "frustrated"
                          ? "😟"
                          : patient.moodStatus === "angry"
                          ? "😠"
                          : patient.moodStatus === "complaining"
                          ? "😤"
                          : "📞"}{" "}
                        {patient.moodStatus}
                      </span>
                      <span
                        className={`px-2 py-1 text-xs rounded-full ${
                          patient.status === "completed"
                            ? "bg-green-100 text-green-800"
                            : patient.status === "failed"
                            ? "bg-red-100 text-red-800"
                            : patient.status === "dispensing"
                            ? "bg-yellow-100 text-yellow-800"
                            : "bg-blue-100 text-blue-800"
                        }`}
                      >
                        {patient.status}
                      </span>
                      {patient.pinned && (
                        <span className="text-purple-600">📌 Pinned</span>
                      )}
                      {patient.assignedConsultant && (
                        <span className="text-blue-600">👨‍⚕️ {game.consultants.find(c => c.id === patient.assignedConsultant)?.name}</span>
                      )}
                    </div>
                    <div className="mb-2">
                      <div className="text-sm font-semibold">Prescription:</div>
                      <div className="text-xs">
                        {Object.entries(patient.prescription)
                          .map(([med, req]) => {
                            const disp = patient.dispensed[med] || 0;
                            return `${med}: ${disp}/${req}`;
                          })
                          .join(", ")}
                      </div>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3">
                      <div
                        className={`h-3 rounded-full transition-all duration-1000 ${
                          patient.waitTime > 10
                            ? "bg-green-500"
                            : patient.waitTime > 5
                            ? "bg-yellow-500"
                            : "bg-red-500"
                        }`}
                        style={{
                          width: `${
                            (patient.waitTime / patient.maxWaitTime) * 100
                          }%`,
                        }}
                      ></div>
                    </div>
                    <div className="text-center mt-1 text-sm font-semibold">
                      {patient.waitTime}s left
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* main board */}
        <div className="md:col-span-6 p-4 flex flex-col items-center justify-center min-h-0 max-h-screen overflow-y-auto">
          {/* 4.1 Statistics */}
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-xl shadow-lg border border-blue-200 mb-4">
            <h3 className="text-xl font-bold mb-3 text-blue-800 flex items-center">
              <span className="text-2xl mr-2">📊</span>
              Pharmacy Statistics
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white p-3 rounded-lg shadow-sm border">
                <div className="text-2xl font-bold text-blue-600">
                  {game.statistics.totalPatients}
                </div>
                <div className="text-sm text-gray-600">Total Patients</div>
              </div>
              <div className="bg-white p-3 rounded-lg shadow-sm border">
                <div className="text-2xl font-bold text-green-600">
                  {game.statistics.completedPatients}
                </div>
                <div className="text-sm text-gray-600">Completed</div>
              </div>
              <div className="bg-white p-3 rounded-lg shadow-sm border">
                <div className="text-2xl font-bold text-red-600">
                  {game.statistics.failedPatients}
                </div>
                <div className="text-sm text-gray-600">Failed</div>
              </div>
              <div className="bg-white p-3 rounded-lg shadow-sm border">
                <div className="text-2xl font-bold text-purple-600">
                  {game.statistics.averageWaitTime.toFixed(1)}s
                </div>
                <div className="text-sm text-gray-600">Avg Wait Time</div>
              </div>
            </div>
          </div>

          {/* Pharmacy Block */}
          <Board />
        </div>

        {/* backoffice management queue */}
        <div className="md:col-span-3 p-4 bg-blue-100 bg-opacity-75 flex flex-col min-h-0 max-h-screen overflow-y-auto">
          {/* Waiting list Orders */}
          <h2 className="text-2xl font-bold mb-4 text-blue-800">
            Waiting Patients
          </h2>
          <Patients />
          {/* 4.2 Statistics */}
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-xl shadow-lg border border-blue-200 mt-4">
            <h3 className="text-lg font-bold mb-3 text-blue-800 flex items-center">
              <span className="text-xl mr-2">📈</span>
              Session Stats
            </h3>
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-white p-2 rounded-lg shadow-sm border text-center">
                <div className="text-lg font-bold text-blue-600">
                  {game.statistics.totalPatients}
                </div>
                <div className="text-xs text-gray-600">Total</div>
              </div>
              <div className="bg-white p-2 rounded-lg shadow-sm border text-center">
                <div className="text-lg font-bold text-green-600">
                  {game.statistics.completedPatients}
                </div>
                <div className="text-xs text-gray-600">Done</div>
              </div>
              <div className="bg-white p-2 rounded-lg shadow-sm border text-center">
                <div className="text-lg font-bold text-red-600">
                  {game.statistics.failedPatients}
                </div>
                <div className="text-xs text-gray-600">Failed</div>
              </div>
              <div className="bg-white p-2 rounded-lg shadow-sm border text-center">
                <div className="text-lg font-bold text-purple-600">
                  {game.statistics.averageWaitTime.toFixed(1)}s
                </div>
                <div className="text-xs text-gray-600">Avg Wait</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
