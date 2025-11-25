import { westernNames, saNames, westernSurnames, saSurnames, medsModalities } from './patientData';

export interface Patient {
  id: number;
  name: string;
  age: number;
  prescription: { [med: string]: number };
  dispensed: { [med: string]: number };
  waitTime: number;
  maxWaitTime: number;
  status: 'waiting' | 'dispensing' | 'completed' | 'failed';
  ticketNumber: number;
  lineType: 'Express' | 'Normal' | 'Priority' | 'Emergency';
  moodStatus: 'calm' | 'impatient' | 'frustrated' | 'angry' | 'complaining' | 'complaint lodged' | 'left';
  pinned: boolean;
  assignedConsultant: number | null;
  moodTimer: number; // Timer for current mood state
  moodStateDuration: number; // Duration for current mood state
  previousMoodStatus: 'calm' | 'impatient' | 'frustrated' | 'angry' | 'complaining' | 'complaint lodged' | 'left';
}

export function generatePatient(currentTime: number = 7 * 60 * 60): Patient {
  const namePool = Math.random() > 0.5 ? westernNames : saNames;
  const surnamePool = Math.random() > 0.5 ? westernSurnames : saSurnames;

  const name = namePool[Math.floor(Math.random() * namePool.length)];
  const surname = surnamePool[Math.floor(Math.random() * surnamePool.length)];
  const age = Math.floor(Math.random() * (65 - 5 + 1)) + 5;

  // Random prescription: 1–3 meds with random quantities
  const meds = Object.keys(medsModalities);
  const prescription: { [med: string]: number } = {};
  const medCount = Math.floor(Math.random() * 3) + 1;

  for (let i = 0; i < medCount; i++) {
    const med = meds[Math.floor(Math.random() * meds.length)];
    prescription[med] = Math.floor(Math.random() * 5) + 1;
  }

  // Determine line type based on time and patient characteristics
  let lineType: 'Express' | 'Normal' | 'Priority' | 'Emergency' = 'Normal';

  // Convert currentTime to hours for easier logic
  const currentHour = Math.floor(currentTime / 3600);

  // Emergency cases - more frequent in later hours (after 6 PM)
  const emergencyChance = currentHour >= 18 ? 0.15 : 0.05; // 15% after 6PM, 5% before
  if (Math.random() < emergencyChance) {
    lineType = 'Emergency';
  }
  // Priority for elderly
  else if (age >= 65) {
    lineType = 'Priority';
  }
  // Express for urgent but not emergency cases
  else if (Math.random() < 0.1) {
    lineType = 'Express';
  }
  // Additional priority chance
  else if (Math.random() < 0.15) {
    lineType = 'Priority';
  }

  // Adjust probabilities for after-hours (reduce Normal, increase others slightly)
  if (currentHour < 7 || currentHour >= 17) { // Before 7AM or after 5PM
    if (lineType === 'Normal' && Math.random() < 0.3) { // 30% chance to upgrade Normal to Express
      lineType = 'Express';
    }
  }

  // Set maxWaitTime based on line type
  let maxWaitTime = 120; // Normal
  if (lineType === 'Express') maxWaitTime = 60;
  else if (lineType === 'Priority') maxWaitTime = 30;
  else if (lineType === 'Emergency') maxWaitTime = 20;

  // Set initial mood state and timer
  const moodDurations = {
    Emergency: { calm: 10, impatient: 10, frustrated: 6, angry: 4, complaining: 2 },
    Express: { calm: 30, impatient: 30, frustrated: 20, angry: 10, complaining: 4 },
    Normal: { calm: 60, impatient: 60, frustrated: 40, angry: 20, complaining: 6 },
    Priority: { calm: 16, impatient: 14, frustrated: 10, angry: 6, complaining: 2 }
  };

  const durations = moodDurations[lineType];
  return {
    id: Date.now(),
    name: `${name} ${surname}`,
    age,
    prescription,
    dispensed: {},
    waitTime: maxWaitTime,
    maxWaitTime,
    status: 'waiting',
    ticketNumber: Math.floor(Math.random() * 1000) + 1, // Random ticket number
    lineType,
    moodStatus: 'calm',
    pinned: false,
    assignedConsultant: null,
    moodTimer: durations.calm,
    moodStateDuration: durations.calm,
    previousMoodStatus: 'calm'
  };
}