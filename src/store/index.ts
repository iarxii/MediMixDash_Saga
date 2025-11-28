import { createSlice, configureStore, PayloadAction } from "@reduxjs/toolkit";
import { dragEndReducer } from "./reducers/dragEnd";
import { moveBelowReducer } from "./reducers/moveBelow";
import { Patient, generatePatient } from "../utils/patientGenerator";

interface Consultant {
  id: number;
  name: string;
  available: boolean;
  stamina: number;
  status: 'available' | 'fetching' | 'busy' | 'closed' | 'helping';
  shiftStart: number;
  shiftEnd: number;
  currentOrder: number | null;
  helpCooldown?: number; // Cooldown timer for help ability
}

interface Manager {
  id: number;
  name: string;
  role: string;
  shiftType: 'day' | 'night';
  stamina: number;
  specialAbility?: {
    name: string;
    description: string;
    requirement: string;
    unlocked: boolean;
  };
}

const initialCandyCrushState: {
  board: string[];
  boardSize: number;
  squareBeingReplaced: Element | undefined;
  squareBeingDragged: Element | undefined;
  dispensed: { [med: string]: number };
  highlighted: number[];
  autoMatched: number[];
  comboMeter: number;
  maxCombo: number;
  comboGain: number;
} = {
  board: [],
  boardSize: 8,
  squareBeingDragged: undefined,
  squareBeingReplaced: undefined,
  dispensed: {},
  highlighted: [],
  autoMatched: [],
  comboMeter: 0,
  maxCombo: 100,
  comboGain: 0,
};

const candyCrushSlice = createSlice({
  name: "candyCrush",
  initialState: initialCandyCrushState,
  reducers: {
    updateBoard: (state, action: PayloadAction<string[]>) => {
      state.board = action.payload;
    },
    dragStart: (state, action: PayloadAction<any>) => {
      state.squareBeingDragged = action.payload;
    },
    dragDrop: (state, action: PayloadAction<any>) => {
      state.squareBeingReplaced = action.payload;
    },
    dragEnd: dragEndReducer,
    moveBelow: moveBelowReducer,
    setDispensed: (state, action: PayloadAction<{ [med: string]: number }>) => {
      state.dispensed = action.payload;
    },
    resetDispensed: (state) => {
      state.dispensed = {};
    },
    setHighlighted: (state, action: PayloadAction<number[]>) => {
      state.highlighted = action.payload;
    },
    setAutoMatched: (state, action: PayloadAction<number[]>) => {
      state.autoMatched = action.payload;
    },
    addCombo: (state, action: PayloadAction<number>) => {
      state.comboMeter = Math.min(state.maxCombo, state.comboMeter + action.payload);
    },
    resetCombo: (state) => {
      state.comboMeter = 0;
    },
    setComboGain: (state, action: PayloadAction<number>) => {
      state.comboGain = action.payload;
    },
  },
});

interface GameState {
  dashPoints: number;
  currency: number;
  morale: number;
  compliments: number;
  complaints: number;
  shiftTime: number;
  shiftDuration: number;
  businessStart: number;
  businessEnd: number;
  currentTime: number;
  gameOver: boolean;
  consultants: Consultant[];
  statistics: {
    totalPatients: number;
    completedPatients: number;
    failedPatients: number;
    averageWaitTime: number;
    totalWaitTime: number;
    totalPatientsQueued: number;
  };
  managers: Manager[];
  currentManager: Manager | null;
  timeFreezeActive: boolean;
  timeFreezeEndTime: number;
  consultantBoostActive: boolean;
  consultantBoostEndTime: number;
  emergencyModeActive: boolean;
  emergencyModeEndTime: number;
}

const gameSlice = createSlice({
  name: "game",
  initialState: {
    dashPoints: 100, // Start with 100 grace points
    currency: 0,
    morale: 50,
    compliments: 0,
    complaints: 0,
    shiftTime: 300,
    shiftDuration: 300,
    businessStart: 7 * 60 * 60, // 7AM in seconds
    businessEnd: 17 * 60 * 60, // 5PM in seconds
    currentTime: 7 * 60 * 60, // Start at 7AM
    gameOver: false,
    consultants: [
      { id: 1, name: 'Alice', available: true, stamina: 100, status: 'available', shiftStart: 7 * 60 * 60, shiftEnd: 17 * 60 * 60, currentOrder: null },
      { id: 2, name: 'Bob', available: true, stamina: 100, status: 'available', shiftStart: 7 * 60 * 60, shiftEnd: 17 * 60 * 60, currentOrder: null },
      { id: 3, name: 'Charlie', available: false, stamina: 80, status: 'closed', shiftStart: 17 * 60 * 60, shiftEnd: 31 * 60 * 60, currentOrder: null }, // Stand-by consultant for night shift (5PM to 7AM next day)
    ] as Consultant[],
    statistics: {
      totalPatients: 0,
      completedPatients: 0,
      failedPatients: 0,
      averageWaitTime: 0,
      totalWaitTime: 0,
      totalPatientsQueued: 0,
    },
    managers: [
      {
        id: 1,
        name: 'Dr. Sarah Mitchell',
        role: 'Day Shift Pharmacy Manager',
        shiftType: 'day',
        stamina: 100,
        specialAbility: {
          name: 'Time Freeze',
          description: 'Freeze all patient timers for 10 seconds',
          requirement: 'Complete 50 patients without complaints',
          unlocked: true
        }
      },
      {
        id: 2,
        name: 'Dr. Michael Chen',
        role: 'Day Shift Pharmacy Manager',
        shiftType: 'day',
        stamina: 100,
        specialAbility: {
          name: 'Consultant Boost',
          description: 'Double consultant speed for 30 seconds',
          requirement: 'Maintain 95%+ patient satisfaction for 24 hours',
          unlocked: false
        }
      },
      {
        id: 3,
        name: 'Dr. Emily Rodriguez',
        role: 'Night Shift Pharmacy Manager',
        shiftType: 'night',
        stamina: 100,
        specialAbility: {
          name: 'Emergency Mode',
          description: 'Automatically prioritize emergency patients',
          requirement: 'Handle 25 emergency cases successfully',
          unlocked: false
        }
      }
    ],
    currentManager: null,
    timeFreezeActive: false,
    timeFreezeEndTime: 0,
    consultantBoostActive: false,
    consultantBoostEndTime: 0,
    emergencyModeActive: false,
    emergencyModeEndTime: 0,
  } as GameState,
  reducers: {
    addDashPoints: (state, action: PayloadAction<number>) => {
      state.dashPoints += action.payload;
    },
    addCurrency: (state, action: PayloadAction<number>) => {
      state.currency += action.payload;
    },
    updateMorale: (state, action: PayloadAction<number>) => {
      state.morale = Math.max(0, Math.min(100, state.morale + action.payload));
    },
    addCompliment: (state) => {
      state.compliments += 1;
    },
    addComplaint: (state) => {
      state.complaints += 1;
    },
    activateTimeFreeze: (state) => {
      state.timeFreezeActive = true;
      state.timeFreezeEndTime = state.currentTime + 10 * 31; // 10 seconds
    },
    deactivateTimeFreeze: (state) => {
      state.timeFreezeActive = false;
    },
    activateConsultantBoost: (state) => {
      state.consultantBoostActive = true;
      state.consultantBoostEndTime = state.currentTime + 30 * 31; // 30 seconds
    },
    deactivateConsultantBoost: (state) => {
      state.consultantBoostActive = false;
    },
    activateEmergencyMode: (state) => {
      state.emergencyModeActive = true;
      state.emergencyModeEndTime = state.currentTime + 60 * 31; // 60 seconds or indefinite?
    },
    deactivateEmergencyMode: (state) => {
      state.emergencyModeActive = false;
    },
    decrementShiftTime: (state) => {
      state.shiftTime = Math.max(0, state.shiftTime - 4);
      state.currentTime += 4; // Increment global time by 4 seconds
      if (state.dashPoints <= 0) {
        state.gameOver = true;
      }
    },
    updateTime: (state) => {
      state.currentTime += 124; // 1 real sec = 2 min 4 sec game time
      // Check ability end times
      if (state.timeFreezeActive && state.currentTime >= state.timeFreezeEndTime) {
        state.timeFreezeActive = false;
      }
      if (state.consultantBoostActive && state.currentTime >= state.consultantBoostEndTime) {
        state.consultantBoostActive = false;
      }
      if (state.emergencyModeActive && state.currentTime >= state.emergencyModeEndTime) {
        state.emergencyModeActive = false;
      }
      // Update consultant statuses based on shift hours
      state.consultants.forEach(consultant => {
        const isBusinessHours = state.currentTime >= consultant.shiftStart && state.currentTime < consultant.shiftEnd;
        const isStandBy = consultant.id === 3; // Charlie is stand-by
        
        if (isStandBy) {
          // Stand-by consultant available outside business hours
          const isOutsideBusinessHours = state.currentTime < state.businessStart || state.currentTime >= state.businessEnd;
          if (isOutsideBusinessHours) {
            if (consultant.status === 'closed') {
              consultant.status = 'available';
              consultant.available = true;
            }
          } else {
            consultant.status = 'closed';
            consultant.available = false;
          }
        } else {
          // Regular consultants
          if (isBusinessHours) {
            if (consultant.status === 'closed') {
              consultant.status = 'available';
              consultant.available = true;
            }
          } else {
            consultant.status = 'closed';
            consultant.available = false;
          }
        }
      });
      if (state.dashPoints <= 0) {
        state.gameOver = true;
      }
    },
    assignConsultantOrder: (state, action: PayloadAction<{ consultantId: number; patientId: number }>) => {
      const consultant = state.consultants.find(c => c.id === action.payload.consultantId);
      if (consultant && consultant.available) {
        consultant.status = 'fetching';
        consultant.currentOrder = action.payload.patientId;
        consultant.available = false;
      }
    },
    completeConsultantOrder: (state, action: PayloadAction<number>) => {
      const consultant = state.consultants.find(c => c.id === action.payload);
      if (consultant) {
        consultant.status = 'available';
        consultant.available = true;
        consultant.currentOrder = null;
        consultant.stamina = Math.max(0, consultant.stamina - 10); // Reduce stamina
      }
    },
    updateStatistics: (state, action: PayloadAction<{ completed: number; failed: number; waitTime: number }>) => {
      state.statistics.totalPatients += 1;
      state.statistics.completedPatients += action.payload.completed;
      state.statistics.failedPatients += action.payload.failed;
      state.statistics.totalWaitTime += action.payload.waitTime;
      state.statistics.averageWaitTime = state.statistics.totalWaitTime / state.statistics.totalPatients;
    },
    incrementTotalQueued: (state) => {
      state.statistics.totalPatientsQueued += 1;
    },
    updateCurrentManager: (state) => {
      const currentHour = Math.floor(state.currentTime / 3600);
      const isDayShift = currentHour >= 7 && currentHour < 17;
      
      // Filter managers by shift type
      const availableManagers = state.managers.filter(m => m.shiftType === (isDayShift ? 'day' : 'night'));
      
      if (availableManagers.length > 0) {
        // Rotate through available managers
        const currentIndex = state.currentManager ? availableManagers.findIndex(m => m.id === state.currentManager!.id) : -1;
        const nextIndex = (currentIndex + 1) % availableManagers.length;
        state.currentManager = availableManagers[nextIndex];
      }
    },
    updateManagerStamina: (state, action: PayloadAction<number>) => {
      if (state.currentManager) {
        state.currentManager.stamina = Math.max(0, Math.min(100, state.currentManager.stamina + action.payload));
      }
    },
    unlockManagerAbility: (state, action: PayloadAction<number>) => {
      const manager = state.managers.find(m => m.id === action.payload);
      if (manager && manager.specialAbility) {
        manager.specialAbility.unlocked = true;
      }
    },
    startConsultantHelp: (state, action: PayloadAction<number>) => {
      const consultant = state.consultants.find(c => c.id === action.payload);
      if (consultant && consultant.status === 'available') {
        consultant.status = 'helping';
        consultant.available = false;
      }
    },
    endConsultantHelp: (state, action: PayloadAction<number>) => {
      const consultant = state.consultants.find(c => c.id === action.payload);
      if (consultant && consultant.status === 'helping') {
        // Calculate helping count before changing status
        const helpingCount = state.consultants.filter(c => c.status === 'helping').length;
        let staminaCost = 15; // Base cost
        
        if (helpingCount >= 2) {
          staminaCost = 12; // Reduced for 2+ helpers
        }
        if (helpingCount >= 3) {
          staminaCost = 10; // Further reduced for 3+ helpers
        }
        
        consultant.status = 'available';
        consultant.available = true;
        consultant.stamina = Math.max(0, consultant.stamina - staminaCost);
        consultant.helpCooldown = 30 * 31; // 30 second cooldown
      }
    },
    updateHelpCooldowns: (state) => {
      state.consultants.forEach(consultant => {
        if (consultant.helpCooldown && consultant.helpCooldown > 0) {
          consultant.helpCooldown -= 124;
          if (consultant.helpCooldown <= 0) {
            consultant.helpCooldown = undefined;
          }
        }
      });
    },
    setConsultantCooldown: (state, action: PayloadAction<{ id: number; cooldown: number }>) => {
      const consultant = state.consultants.find(c => c.id === action.payload.id);
      if (consultant) {
        consultant.helpCooldown = action.payload.cooldown;
      }
    },
    callAllConsultantsHelp: (state) => {
      const availableConsultants = state.consultants.filter(c => c.status === 'available' && !c.helpCooldown);
      availableConsultants.forEach(consultant => {
        consultant.status = 'helping';
        consultant.available = false;
        consultant.helpCooldown = 20; // 20 second cooldown for all-consultants help
      });
    },
  },
});

const patientsSlice = createSlice({
  name: "patients",
  initialState: [] as Patient[],
  reducers: {
    setPatients: (state, action: PayloadAction<Patient[]>) => {
      return action.payload;
    },
    addPatient: (state) => {
      state.push(generatePatient());
    },
    updatePatient: (state, action: PayloadAction<{ id: number; updates: Partial<Patient> }>) => {
      const patient = state.find(p => p.id === action.payload.id);
      if (patient) {
        Object.assign(patient, action.payload.updates);
      }
    },
    dispenseMed: (state, action: PayloadAction<{ med: string; amount: number }>) => {
      // Find first patient who needs this med
      const patient = state.find(p => (p.prescription[action.payload.med] || 0) > (p.dispensed[action.payload.med] || 0));
      if (patient) {
        patient.dispensed[action.payload.med] = (patient.dispensed[action.payload.med] || 0) + action.payload.amount;
        // Check if completed
        const completed = Object.entries(patient.prescription).every(([med, req]) => (patient.dispensed[med] || 0) >= req);
        if (completed) {
          patient.status = 'completed';
        }
      }
    },
    updateTimers: (state) => {
      state.forEach(p => {
        p.waitTime = Math.max(0, p.waitTime - 124);
        
        // Update mood timer and state transitions
        if (p.status === 'waiting') {
          p.moodTimer = Math.max(0, p.moodTimer - 124);
          
          if (p.moodTimer === 0) {
            const moodDurations = {
              Emergency: { calm: 10 * 31, impatient: 10 * 31, frustrated: 6 * 31, angry: 4 * 31, complaining: 2 * 31 },
              Express: { calm: 30 * 31, impatient: 30 * 31, frustrated: 20 * 31, angry: 10 * 31, complaining: 4 * 31 },
              Normal: { calm: 60 * 31, impatient: 60 * 31, frustrated: 40 * 31, angry: 20 * 31, complaining: 6 * 31 },
              Priority: { calm: 16 * 31, impatient: 14 * 31, frustrated: 10 * 31, angry: 6 * 31, complaining: 2 * 31 }
            };
            
            const durations = moodDurations[p.lineType];
            
            if (p.moodStatus === 'calm') {
              p.previousMoodStatus = p.moodStatus;
              p.moodStatus = 'impatient';
              p.moodTimer = durations.impatient;
              p.moodStateDuration = durations.impatient;
            } else if (p.moodStatus === 'impatient') {
              p.previousMoodStatus = p.moodStatus;
              p.moodStatus = 'frustrated';
              p.moodTimer = durations.frustrated;
              p.moodStateDuration = durations.frustrated;
            } else if (p.moodStatus === 'frustrated') {
              p.previousMoodStatus = p.moodStatus;
              p.moodStatus = 'angry';
              p.moodTimer = durations.angry;
              p.moodStateDuration = durations.angry;
            } else if (p.moodStatus === 'angry') {
              p.previousMoodStatus = p.moodStatus;
              p.moodStatus = 'complaining';
              p.moodTimer = durations.complaining;
              p.moodStateDuration = durations.complaining;
            } else if (p.moodStatus === 'complaining') {
              p.previousMoodStatus = p.moodStatus;
              // 3% chance patient leaves instead of lodging complaint
              if (Math.random() < 0.03) {
                p.moodStatus = 'left';
                p.status = 'failed';
              } else {
                p.moodStatus = 'complaint lodged';
                p.status = 'failed'; // Mark as failed so they get cleaned up, but complaint is still lodged
              }
            }
          }
        }
        
        // Only fail patients if their wait time runs out and they're still waiting
        if (p.waitTime === 0 && p.status === 'waiting') {
          p.status = 'failed';
        }
      });
    },
    pinPatient: (state, action: PayloadAction<number>) => {
      const patient = state.find(p => p.id === action.payload);
      if (patient) {
        patient.pinned = !patient.pinned;
      }
    },
    cleanupPatients: (state, action: PayloadAction<number>) => {
      // Remove completed and failed patients
      const activePatients = state.filter(p => p.status === 'waiting' || p.status === 'dispensing');
      const patientsAdded = Math.max(0, 3 - activePatients.length);
      // Add new patients to reach 3
      for (let i = 0; i < patientsAdded; i++) {
        activePatients.push(generatePatient(action.payload));
      }
      return activePatients;
    },
  },
});

export const store = configureStore({
  reducer: {
    candyCrush: candyCrushSlice.reducer,
    game: gameSlice.reducer,
    patients: patientsSlice.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export const { updateBoard, moveBelow, dragDrop, dragEnd, dragStart, setDispensed, resetDispensed, setHighlighted, setAutoMatched, addCombo, resetCombo, setComboGain } =
  candyCrushSlice.actions;

export const { addDashPoints, addCurrency, updateMorale, addCompliment, addComplaint, decrementShiftTime, updateStatistics, updateTime, assignConsultantOrder, completeConsultantOrder, updateCurrentManager, updateManagerStamina, unlockManagerAbility, startConsultantHelp, endConsultantHelp, updateHelpCooldowns, setConsultantCooldown, callAllConsultantsHelp, incrementTotalQueued, activateTimeFreeze, deactivateTimeFreeze, activateConsultantBoost, deactivateConsultantBoost, activateEmergencyMode, deactivateEmergencyMode } =
  gameSlice.actions;

export const { setPatients, addPatient, updatePatient, dispenseMed, updateTimers, cleanupPatients, pinPatient } = patientsSlice.actions;

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
