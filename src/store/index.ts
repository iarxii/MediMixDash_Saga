import { createSlice, configureStore, PayloadAction } from "@reduxjs/toolkit";
import { dragEndReducer } from "./reducers/dragEnd";
import { moveBelowReducer } from "./reducers/moveBelow";

interface Patient {
  id: number;
  name: string;
  prescription: { [med: string]: number };
  dispensed: { [med: string]: number };
  waitTime: number;
  maxWaitTime: number;
  status: 'waiting' | 'dispensing' | 'completed' | 'failed';
}

const initialCandyCrushState: {
  board: string[];
  boardSize: number;
  squareBeingReplaced: Element | undefined;
  squareBeingDragged: Element | undefined;
  dispensed: { [med: string]: number };
} = {
  board: [],
  boardSize: 8,
  squareBeingDragged: undefined,
  squareBeingReplaced: undefined,
  dispensed: {},
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
  },
});

const gameSlice = createSlice({
  name: "game",
  initialState: {
    dashPoints: 0,
    currency: 0,
    morale: 50,
    compliments: 0,
    complaints: 0,
    shiftTime: 300,
    shiftDuration: 300,
  },
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
    decrementShiftTime: (state) => {
      state.shiftTime = Math.max(0, state.shiftTime - 1);
    },
    resetShift: (state) => {
      state.shiftTime = state.shiftDuration;
      state.currency = 0;
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
        p.waitTime = Math.max(0, p.waitTime - 1);
        if (p.waitTime === 0 && p.status !== 'completed') {
          p.status = 'failed';
        }
      });
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

export const { updateBoard, moveBelow, dragDrop, dragEnd, dragStart, setDispensed, resetDispensed } =
  candyCrushSlice.actions;

export const { addDashPoints, addCurrency, updateMorale, addCompliment, addComplaint, decrementShiftTime, resetShift } =
  gameSlice.actions;

export const { setPatients, updatePatient, dispenseMed, updateTimers } = patientsSlice.actions;

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
