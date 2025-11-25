import { useEffect, useState } from "react";
import BackgroundCarousel from "./components/BackgroundCarousel";
import Board from "./components/Board";
import Consultant from "./components/Consultant";
import Patients from "./components/Patients";
import Statistics from "./components/Statistics";
import { moveBelow, updateBoard, resetDispensed, updateTime, assignConsultantOrder, addDashPoints, addComplaint, updateCurrentManager, updateHelpCooldowns, updateStatistics, addCurrency, updateMorale, addCompliment, incrementTotalQueued, setHighlighted, /* setConsultantCooldown, */ callAllConsultantsHelp, setAutoMatched, /* startConsultantHelp, */ endConsultantHelp, setPatients, dispenseMed, updateTimers, cleanupPatients, dragEnd, updatePatient, pinPatient } from "./store";
import { useAppDispatch, useAppSelector } from "./store/hooks";
import { createBoard } from "./utils/createBoard";
import { findValidMoves } from "./utils/findValidMoves";
import { findSmartRearrangements } from "./utils/findValidMoves";
import { generatePatient } from "./utils/patientGenerator";
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

  // Add state for consultant help visual effects
  const [consultantHelpActive, setConsultantHelpActive] = useState(false);
  const [helpPopupMessage, setHelpPopupMessage] = useState<string | null>(null);
  const [helpPopupVisible, setHelpPopupVisible] = useState(false);

  // Mobile UI state
  const [showPatientsPanel, setShowPatientsPanel] = useState(false);
  const [showStatsPanel, setShowStatsPanel] = useState(false);

  // Game speed: 1 real second = 4 game seconds (configurable)

  // Helper function to detect all matches on the board
  const detectAllMatches = (board: string[], boardSize: number): number[] => {
    const allMatches: number[] = [];
    
    // Check for column of four
    for (let i = 0; i <= formulaForColumnOfFour(boardSize); i++) {
      const columnOfFour = isColumnOfFour(board, boardSize, formulaForColumnOfFour(boardSize));
      if (columnOfFour.length > 0) {
        allMatches.push(...columnOfFour);
      }
    }
    
    // Check for row of four
    const rowOfFour = checkForRowOfFour(board, boardSize, generateInvalidMoves(boardSize, true));
    if (rowOfFour.length > 0) {
      allMatches.push(...rowOfFour);
    }
    
    // Check for column of three
    const columnOfThree = checkForColumnOfThree(board, boardSize, formulaForColumnOfThree(boardSize));
    if (columnOfThree.length > 0) {
      allMatches.push(...columnOfThree);
    }
    
    // Check for row of three
    const rowOfThree = checkForRowOfThree(board, boardSize, generateInvalidMoves(boardSize));
    if (rowOfThree.length > 0) {
      allMatches.push(...rowOfThree);
    }
    
    // Remove duplicates
    return allMatches.filter((item, index) => allMatches.indexOf(item) === index);
  };

  useEffect(() => {
    dispatch(updateBoard(createBoard(boardSize)));
    // Initialize patients
    const initialPatients = [generatePatient(7 * 60 * 60), generatePatient(7 * 60 * 60), generatePatient(7 * 60 * 60)];
    dispatch(setPatients(initialPatients));
    // Increment total queued counter for initial patients
    for (let i = 0; i < initialPatients.length; i++) {
      dispatch(incrementTotalQueued());
    }
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
      // Check for completed/failed patients before updating timers
      const completedPatients = patients.filter(p => p.status === 'completed');
      const failedPatients = patients.filter(p => p.status === 'failed');
      
      dispatch(updateTimers());
      
      // Update statistics for completed/failed patients
      if (completedPatients.length > 0 || failedPatients.length > 0) {
        completedPatients.forEach(patient => {
          const waitTime = patient.maxWaitTime - patient.waitTime;
          dispatch(updateStatistics({ completed: 1, failed: 0, waitTime }));
          dispatch(addDashPoints(50)); // Base completion points
          dispatch(addCurrency(10)); // Currency reward
          dispatch(updateMorale(5)); // Morale boost
          dispatch(addCompliment()); // Add compliment
        });
        
        failedPatients.forEach(patient => {
          const waitTime = patient.maxWaitTime - patient.waitTime;
          dispatch(updateStatistics({ completed: 0, failed: 1, waitTime }));
          dispatch(addDashPoints(-30)); // Failure penalty
          dispatch(updateMorale(-10)); // Morale penalty
          dispatch(addComplaint()); // Add complaint
        });
      }
      
      // Count active patients before cleanup
      const activePatientsBefore = patients.filter(p => p.status === 'waiting' || p.status === 'dispensing').length;
      
      dispatch(cleanupPatients(game.currentTime));
      
      // Increment total queued counter for new patients added during cleanup
      const patientsAdded = Math.max(0, 3 - activePatientsBefore);
      for (let i = 0; i < patientsAdded; i++) {
        dispatch(incrementTotalQueued());
      }
      dispatch(updateTime());
      dispatch(updateCurrentManager());
      dispatch(updateHelpCooldowns());
    }, 1000);
    return () => clearInterval(interval);
  }, [dispatch, game.currentTime, patients]);

  // Check for mood state changes and apply penalties
  useEffect(() => {
    patients.forEach(patient => {
      if (patient.moodStatus !== patient.previousMoodStatus) {
        if (patient.moodStatus === 'complaint lodged') {
          // 3% deduction for complaint lodged
          const penalty = Math.floor(game.dashPoints * 0.03);
          dispatch(addDashPoints(-penalty));
          dispatch(addComplaint());
        } else if (patient.moodStatus === 'left') {
          // 10% deduction for patient leaving
          const penalty = Math.floor(game.dashPoints * 0.10);
          dispatch(addDashPoints(-penalty));
        }
      }
    });
  }, [patients, game.dashPoints, dispatch]);

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
      
      // Check for any remaining matches after board update and highlight them
      setTimeout(() => {
        const matches = detectAllMatches(newBoard, boardSize);
        if (matches.length > 0) {
          dispatch(setHighlighted(matches));
          // Clear highlighting after 2 seconds
          setTimeout(() => {
            dispatch(setHighlighted([]));
          }, 2000);
        }
      }, 200); // Small delay to allow board to settle
    }, 150);
    return () => clearTimeout(timeout);
  }, [board, dispatch, boardSize]);

  return (
    <div className="h-screen">
      <BackgroundCarousel />
      
      {/* Consultant Help Popup */}
      {helpPopupVisible && helpPopupMessage && (
        <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 animate-bounce">
          <div className="bg-blue-600 text-white px-6 py-3 rounded-lg shadow-lg border-2 border-blue-300">
            <div className="flex items-center space-x-2">
              <span className="text-2xl">🧠</span>
              <span className="font-bold text-lg">{helpPopupMessage}</span>
            </div>
          </div>
        </div>
      )}
      
      {/* Consultant Help Overlay */}
      {consultantHelpActive && (
        <div className="fixed inset-0 bg-blue-500 bg-opacity-10 pointer-events-none z-40">
          <div className="absolute top-20 left-1/2 transform -translate-x-1/2">
            <div className="bg-white bg-opacity-90 px-4 py-2 rounded-lg shadow-lg border-2 border-blue-400 animate-pulse">
              <div className="flex items-center space-x-2 text-blue-800">
                <span className="text-xl animate-spin">⚡</span>
                <span className="font-semibold">Consultants Optimizing Board</span>
                <span className="text-xl animate-spin">⚡</span>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Mobile Navigation */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-300 p-2 flex justify-around z-50">
        <button
          onClick={() => setShowPatientsPanel(!showPatientsPanel)}
          className={`flex flex-col items-center p-2 rounded-lg ${showPatientsPanel ? 'bg-blue-100' : 'hover:bg-gray-100'}`}
        >
          <span className="text-2xl">👥</span>
          <span className="text-xs">Patients</span>
        </button>
        <button
          onClick={() => {
            setShowPatientsPanel(false);
            setShowStatsPanel(false);
          }}
          className="flex flex-col items-center p-2 rounded-lg bg-blue-500 text-white"
        >
          <span className="text-2xl">🏥</span>
          <span className="text-xs">Board</span>
        </button>
        <button
          onClick={() => setShowStatsPanel(!showStatsPanel)}
          className={`flex flex-col items-center p-2 rounded-lg ${showStatsPanel ? 'bg-blue-100' : 'hover:bg-gray-100'}`}
        >
          <span className="text-2xl">📊</span>
          <span className="text-xs">Stats</span>
        </button>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-12 h-full pb-16 lg:pb-0">
        {/* Patients Waiting Area / front-desk */}
        <div className={`lg:col-span-3 p-2 lg:p-4 bg-blue-100 bg-opacity-75 flex flex-col min-h-0 max-h-screen overflow-y-auto ${showPatientsPanel ? 'block' : 'hidden lg:block'}`}>
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
                <h3 className="text-sm lg:text-lg font-bold text-center">Current Time</h3>
                <p className="text-center text-lg lg:text-xl">
                  {Math.floor(game.currentTime / 3600)}:
                  {Math.floor((game.currentTime % 3600) / 60).toString().padStart(2, "0")}:
                  {(game.currentTime % 60).toString().padStart(2, "0")}
                </p>
                {game.gameOver && <p className="text-center text-red-600 font-bold text-sm lg:text-base">Game Over!</p>}
              </div>

              {/* 2. Pharmacy Consultant Windows - 5 rows */}
              <div className="flex-1 bg-white p-2 rounded shadow overflow-y-auto min-h-[360px]">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-lg font-bold">Consultants</h3>
                  <button
                    onClick={() => {
                      const availableConsultants = game.consultants.filter(c => c.status === 'available' && !c.helpCooldown);
                      if (availableConsultants.length > 0) {
                        // Set all available consultants to helping status with 20s cooldown
                        dispatch(callAllConsultantsHelp());
                        
                        // Activate visual help effects
                        setConsultantHelpActive(true);
                        setHelpPopupMessage(`${availableConsultants.length} consultant${availableConsultants.length > 1 ? 's are' : ' is'} optimizing the board!`);
                        setHelpPopupVisible(true);
                        setTimeout(() => setHelpPopupVisible(false), 3000);
                        
                        // Trigger help effects
                        const validMoves = findValidMoves(board, boardSize);
                        dispatch(setHighlighted(validMoves));
                        
                        // Calculate total helping count (available consultants that will be set to helping)
                        const totalHelpingCount = availableConsultants.length;
                        
                        let helpDuration = 10000; // Default 10 seconds
                        let autoMatchInterval: NodeJS.Timeout | null = null;
                        
                        if (totalHelpingCount >= 3) {
                          helpDuration = 10000; // 10 seconds for 3+
                          // Start smart rearrangement for maximum efficiency
                          autoMatchInterval = setInterval(() => {
                            const smartRearrangements = findSmartRearrangements(board, boardSize);
                            if (smartRearrangements.length > 0) {
                              // Use the best rearrangement
                              const bestRearrangement = smartRearrangements[0];
                              dispatch(setAutoMatched([bestRearrangement.fromIndex, bestRearrangement.toIndex]));
                              dispatch({ type: 'candyCrush/dragStart', payload: { getAttribute: () => bestRearrangement.fromIndex.toString() } });
                              dispatch({ type: 'candyCrush/dragDrop', payload: { getAttribute: () => bestRearrangement.toIndex.toString() } });
                              dispatch(dragEnd());
                              setTimeout(() => dispatch(setAutoMatched([])), 1000);
                            } else {
                              // Fallback to regular valid moves if no smart rearrangements found
                              const currentValidMoves = findValidMoves(board, boardSize);
                              if (currentValidMoves.length > 0) {
                                const firstValidIndex = currentValidMoves[0];
                                if (firstValidIndex !== undefined) {
                                  const col = firstValidIndex % boardSize;
                                  if (col < boardSize - 1) {
                                    const rightIndex = firstValidIndex + 1;
                                    dispatch(setAutoMatched([firstValidIndex, rightIndex]));
                                    dispatch({ type: 'candyCrush/dragStart', payload: { getAttribute: () => firstValidIndex.toString() } });
                                    dispatch({ type: 'candyCrush/dragDrop', payload: { getAttribute: () => rightIndex.toString() } });
                                    dispatch(dragEnd());
                                    setTimeout(() => dispatch(setAutoMatched([])), 1000);
                                  }
                                }
                              }
                            }
                          }, 2000);
                        } else if (totalHelpingCount >= 2) {
                          helpDuration = 20000; // 20 seconds for 2
                          // Start smart rearrangement - look for tiles in proximity that can be rearranged for better matches
                          autoMatchInterval = setInterval(() => {
                            const smartRearrangements = findSmartRearrangements(board, boardSize);
                            if (smartRearrangements.length > 0) {
                              // Use the best rearrangement
                              const bestRearrangement = smartRearrangements[0];
                              dispatch(setAutoMatched([bestRearrangement.fromIndex, bestRearrangement.toIndex]));
                              dispatch({ type: 'candyCrush/dragStart', payload: { getAttribute: () => bestRearrangement.fromIndex.toString() } });
                              dispatch({ type: 'candyCrush/dragDrop', payload: { getAttribute: () => bestRearrangement.toIndex.toString() } });
                              dispatch(dragEnd());
                              setTimeout(() => dispatch(setAutoMatched([])), 1000);
                            } else {
                              // Fallback to regular valid moves if no smart rearrangements found
                              const currentValidMoves = findValidMoves(board, boardSize);
                              if (currentValidMoves.length > 0) {
                                const firstValidIndex = currentValidMoves[0];
                                if (firstValidIndex !== undefined) {
                                  const col = firstValidIndex % boardSize;
                                  if (col < boardSize - 1) {
                                    const rightIndex = firstValidIndex + 1;
                                    dispatch(setAutoMatched([firstValidIndex, rightIndex]));
                                    dispatch({ type: 'candyCrush/dragStart', payload: { getAttribute: () => firstValidIndex.toString() } });
                                    dispatch({ type: 'candyCrush/dragDrop', payload: { getAttribute: () => rightIndex.toString() } });
                                    dispatch(dragEnd());
                                    setTimeout(() => dispatch(setAutoMatched([])), 1000);
                                  }
                                }
                              }
                            }
                          }, 2500); // Slightly slower interval for more strategic moves
                        } else if (totalHelpingCount >= 1) {
                          helpDuration = 10000; // 10 seconds for 1 (just highlighting, no auto-matching)
                          // No auto-matching for single consultant - just highlighting
                        }
                        
                        // End help after duration
                        setTimeout(() => {
                          if (autoMatchInterval) clearInterval(autoMatchInterval);
                          // End help for all consultants that were helping
                          availableConsultants.forEach(consultant => {
                            dispatch(endConsultantHelp(consultant.id));
                          });
                          dispatch(setHighlighted([]));
                          setConsultantHelpActive(false);
                          setHelpPopupMessage(`${availableConsultants.length} consultant${availableConsultants.length > 1 ? 's' : ''} finished optimizing!`);
                          setHelpPopupVisible(true);
                          setTimeout(() => setHelpPopupVisible(false), 2000);
                        }, helpDuration);
                      }
                    }}
                    className={`font-bold py-2 px-4 rounded-lg shadow-lg transform hover:scale-105 transition-all duration-200 ${
                      consultantHelpActive
                        ? 'bg-green-500 hover:bg-green-600 text-white animate-pulse'
                        : 'bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white'
                    } disabled:opacity-50 disabled:cursor-not-allowed`}
                    disabled={game.consultants.filter(c => c.status === 'available' && !c.helpCooldown).length === 0}
                  >
                    {consultantHelpActive ? '🧠 Optimizing...' : '🚨 Call All for Help'}
                  </button>
                </div>
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
        <div className="lg:col-span-6 p-2 lg:p-4 flex flex-col items-center justify-center min-h-0 max-h-screen overflow-y-auto">
          {/* Pharmacy Block */}
          <Board />

          {/* Statistics and Complaints Row */}
          <div className="w-full mb-4 grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* 4.1 Statistics */}
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-xl shadow-lg border border-blue-200">
              <h3 className="text-lg lg:text-xl font-bold mb-3 text-blue-800 flex items-center">
                <span className="text-xl lg:text-2xl mr-2">📊</span>
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

            {/* 4.2 Complaints & Manager */}
            <div className="bg-gradient-to-r from-red-50 to-orange-50 p-4 rounded-xl shadow-lg border border-red-200">
              <h3 className="text-lg lg:text-xl font-bold mb-3 text-red-800 flex items-center">
                <span className="text-xl lg:text-2xl mr-2">📞</span>
                Complaints & Management
              </h3>
              <div className="space-y-4">
                {/* Current Manager */}
                <div className="bg-white p-3 rounded-lg shadow-sm border">
                  {game.currentManager ? (() => {
                    const manager = game.currentManager!;
                    return (
                      <>
                        <div className="flex items-center space-x-3">
                          <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center text-white text-xl font-bold">
                            {manager.name.charAt(0)}
                          </div>
                          <div className="flex-1">
                            <div className="font-semibold text-gray-800">{manager.name}</div>
                            <div className="text-sm text-gray-600">{manager.role}</div>
                            <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                              <div
                                className="bg-gradient-to-r from-green-400 to-blue-500 h-2 rounded-full transition-all duration-300"
                                style={{ width: `${manager.stamina}%` }}
                              ></div>
                            </div>
                            <div className="text-xs text-gray-500 mt-1">Stamina: {manager.stamina}%</div>
                          </div>
                        </div>

                        {/* Manager Special Ability */}
                        {manager.specialAbility && manager.specialAbility.unlocked && (
                          <div className="mt-3 p-2 bg-gradient-to-r from-yellow-100 to-orange-100 rounded-lg border border-yellow-300">
                            <div className="text-sm font-semibold text-yellow-800">🎯 Special Ability</div>
                            <div className="text-xs text-yellow-700">{manager.specialAbility.description}</div>
                            <div className="text-xs text-gray-600 mt-1">
                              Unlocked at: {manager.specialAbility.requirement}
                            </div>
                          </div>
                        )}
                      </>
                    );
                  })() : (
                    <div className="text-center text-gray-500 py-4">
                      <div className="text-lg">👨‍💼</div>
                      <div className="text-sm">No manager on duty</div>
                    </div>
                  )}
                </div>

                {/* Complaints Stats */}
                <div className="bg-white p-3 rounded-lg shadow-sm border">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-semibold text-gray-700">Complaints Today</span>
                    <span className="text-lg font-bold text-red-600">{game.complaints}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-semibold text-gray-700">Patients Left</span>
                    <span className="text-lg font-bold text-orange-600">
                      {patients.filter(p => p.moodStatus === 'left').length}
                    </span>
                  </div>
                </div>

              </div>
            </div>
          </div>
        </div>

        {/* backoffice management queue */}
        <div className={`lg:col-span-3 p-2 lg:p-4 bg-blue-100 bg-opacity-75 flex flex-col min-h-0 max-h-screen overflow-y-auto ${showStatsPanel ? 'block' : 'hidden lg:block'}`}>
          {/* Waiting list Orders */}
          {(() => {
            const currentWaiting = patients.filter(p => p.status === 'waiting').length;
            const totalQueued = game.statistics.totalPatientsQueued;
            const completed = game.statistics.completedPatients;
            const failed = game.statistics.failedPatients;
            const pending = patients.filter(p => p.status === 'waiting' || p.status === 'dispensing').length;
            const totalProcessed = game.statistics.totalPatients;
            
            // Calculate success rate: successful dispensed divided by total patients
            const successRate = totalProcessed > 0 ? Math.round((completed / totalProcessed) * 100) : 0;
            
            // Calculate total time taken since game start (7AM)
            const startTime = 7 * 60 * 60; // 7AM in seconds
            const totalSecondsTaken = game.currentTime - startTime;
            
            // Format total time taken
            let totalTimeDisplay = '';
            if (totalSecondsTaken < 60) {
              totalTimeDisplay = `${totalSecondsTaken}s`;
            } else if (totalSecondsTaken < 3600) {
              const minutes = Math.floor(totalSecondsTaken / 60);
              const seconds = totalSecondsTaken % 60;
              totalTimeDisplay = `${minutes}m ${seconds}s`;
            } else {
              const hours = Math.floor(totalSecondsTaken / 3600);
              const minutes = Math.floor((totalSecondsTaken % 3600) / 60);
              totalTimeDisplay = `${hours}h ${minutes}m`;
            }
            
            // Determine performance rating
            let performanceRating = '';
            let ratingColor = '';
            if (successRate > 100) {
              performanceRating = 'Error';
              ratingColor = 'text-red-600';
            } else if (successRate >= 91) {
              performanceRating = 'Excellent performance';
              ratingColor = 'text-green-600';
            } else if (successRate >= 61) {
              performanceRating = 'Picking up the pace';
              ratingColor = 'text-blue-600';
            } else if (successRate >= 31) {
              performanceRating = 'Slow';
              ratingColor = 'text-yellow-600';
            } else {
              performanceRating = 'Poor';
              ratingColor = 'text-red-600';
            }
            
            return (
              <div className="bg-white p-2 rounded shadow mb-4 sticky top-0 z-10">
                <h2 className="text-lg lg:text-2xl font-bold text-blue-800">
                  Waiting Patients ({currentWaiting}/{totalQueued})
                </h2>
                <div className="text-sm text-gray-600 mt-1">
                  Completed: <span className="text-green-600 font-semibold">{completed}</span> | 
                  Failed: <span className="text-red-600 font-semibold">{failed}</span> | 
                  Pending: <span className="text-blue-600 font-semibold">{pending}</span> | 
                  Success Rate: <span className="font-semibold">{successRate}%</span> | 
                  <span className={`font-semibold ${ratingColor}`}>{performanceRating}</span>
                </div>
                <div className="text-sm text-gray-600 mt-1">
                  Total Time Taken: <span className="font-semibold text-purple-600">{totalTimeDisplay}</span>
                </div>
              </div>
            );
          })()}
          <Patients />
          {/* Statistics Dashboard */}
          <Statistics />
        </div>
      </div>
    </div>
  );
}

export default App;
