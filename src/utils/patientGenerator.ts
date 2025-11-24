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
  lineType: 'Express' | 'Normal' | 'Priority';
  moodStatus: 'calm' | 'impatient' | 'frustrated' | 'angry' | 'complaining' | 'complaint lodged';
  pinned: boolean;
}

export function generatePatient(): Patient {
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

  // Determine line type
  let lineType: 'Express' | 'Normal' | 'Priority' = 'Normal';
  if (age >= 65) lineType = 'Priority';
  else if (Math.random() < 0.1) lineType = 'Express'; // 10% chance for express
  else if (Math.random() < 0.2) lineType = 'Priority'; // Additional 20% for priority (pregnant/emergency)

  // Set maxWaitTime based on line type
  let maxWaitTime = 60; // Normal
  if (lineType === 'Express') maxWaitTime = 30;
  else if (lineType === 'Priority') maxWaitTime = 15;

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
    pinned: false
  };
}