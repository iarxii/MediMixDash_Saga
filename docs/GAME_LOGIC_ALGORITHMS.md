# MediMixDash Saga Game Logic and Algorithms

## Overview
MediMixDash Saga is a pharmacy management simulation game with match-3 mechanics for dispensing medications. The game integrates real-time patient management, consultant assistance, and scoring systems.

## Core Components

### 1. Board Game Mechanics
The main gameplay revolves around a match-3 board where players swap medication tiles to create matches of 3 or more identical items.

#### Match Detection Algorithm
- **Horizontal Matching**: Scans each row for consecutive identical tiles (≥3)
- **Vertical Matching**: Scans each column for consecutive identical tiles (≥3)
- **Match Removal**: Identified matches are removed, triggering gravity and refill
- **Dispensing Logic**: Matched tiles correspond to medications dispensed to patients

#### Valid Move Detection
The `findValidMoves` function identifies all possible swaps that would create valid matches:
- Iterates through all board positions
- Tests swapping with adjacent tiles (right and down)
- Simulates the swap and checks for new matches
- Returns array of tile indices that are part of valid moves

### 2. Patient Management System

#### Patient States
- **Waiting**: Patient in queue, waiting for service
- **Dispensing**: Patient actively receiving medications
- **Completed**: All prescriptions fulfilled
- **Failed**: Wait time exceeded without completion

#### Sentiment Progression
Patients' mood states have independent timers that restart when entering each state:
- **Calm 😊**: Initial state with dedicated timer
- **Impatient 😐**: Transitions after calm timer expires
- **Frustrated 😟**: Transitions after impatient timer expires  
- **Angry 😠**: Transitions after frustrated timer expires
- **Complaining 😤**: Transitions after angry timer expires
- **Complaint Lodged 📞**: Final state (3% score deduction)
- **Left 👋**: 3% chance patient leaves instead (10% score deduction)

Each mood state has its own duration based on line type:
- **Emergency**: Calm(5s) → Impatient(5s) → Frustrated(3s) → Angry(2s) → Complaining(1s)
- **Express**: Calm(15s) → Impatient(15s) → Frustrated(10s) → Angry(5s) → Complaining(2s)
- **Normal**: Calm(30s) → Impatient(30s) → Frustrated(20s) → Angry(10s) → Complaining(3s)
- **Priority**: Calm(8s) → Impatient(7s) → Frustrated(5s) → Angry(3s) → Complaining(1s)

#### Queue Management
- **Emergency Line**: 10 seconds max wait (highest priority)
- **Express Line**: 30 seconds max wait
- **Normal Line**: 60 seconds max wait
- **Priority Line**: 15 seconds max wait
- **Sorting**: Pinned patients first, then by newest ID
- **Time-based Generation**: Emergency cases more frequent after 6PM, Normal patients reduced after hours

### 3. Consultant System

#### Consultant States
- **Available**: Ready for assignment ✅
- **Fetching**: Retrieving order 🔄
- **Busy**: Processing order 🏃‍♂️
- **Closed**: Outside shift hours 🚪

#### Shift Management
- **Regular Consultants**: Available 7AM - 5PM (Alice, Bob)
- **Stand-by Consultant**: Available outside business hours (Charlie)
- Automatic status updates based on current time
- Stamina system affects performance

#### Help Functionality
- **Call for Help Button**: Triggers highlighting of valid moves on the board
- **Highlight Algorithm**: Uses `findValidMoves` to identify swappable tiles
- **Visual Effect**: Pulsing animation on valid tiles with blue glow

#### Patient Assignment
- Automatic assignment when patient status changes to 'dispensing'
- Finds first available consultant
- Updates both patient and consultant records

### 4. Scoring and Points System

#### Base Scoring
- **Patient Completion**: +50 points
- **Speed Bonus**: +20 points if completed with >50% time remaining
- **Failure Penalty**: -30 points

#### Sentiment Penalties
- **Complaint Lodged**: 3% deduction from current dash points
- **Patient Leaves**: 10% deduction from current dash points (3% chance when complaining timer expires)
- Penalties applied immediately when mood state changes

#### Combo System
- Bonus points for dispensing orders with 5+ seconds remaining
- Multiplier system for consecutive fast dispenses

#### Game Over
- Points reach 0 or below
- Start with 100 grace points

### 5. Time Management

#### Global Time
- Real-time progression (1 second = 1 game second)
- Affects consultant shifts, patient wait times, and business hours
- **24-hour operation** with stand-by consultants outside regular hours

#### Business Hours
- **Regular Hours**: 7AM - 5PM (full consultant staff)
- **After Hours**: 5PM - 7AM (stand-by consultant only)
- Emergency cases more frequent during later hours

#### Timer Updates
- Patient wait times decrement every second
- Mood status updates based on time ratios
- Consultant status checks against current time

## Algorithm Implementations

### findValidMoves(board, boardSize)
```typescript
// Scans board for all possible valid swaps
// Returns array of tile indices that can be swapped
// Used for consultant help highlighting
```

### Patient Generation Algorithm
```typescript
generatePatient(currentTime)
// Time-based line assignment:
// - Emergency: 15% chance after 6PM, 5% before (10s max wait)
// - Priority: Elderly (65+) or random chance (15s max wait)
// - Express: Random chance (30s max wait)
// - Normal: Default (60s max wait)
// After-hours adjustments: Reduce Normal, increase Express
```

### Patient Sentiment Calculation
```typescript
// Each mood state has independent timer that resets on transition
updateMoodTimers(patient) {
  patient.moodTimer--;
  if (patient.moodTimer <= 0 && patient.status === 'waiting') {
    // Transition to next mood state with new timer duration
    transitionToNextMoodState(patient);
  }
}

// Mood state durations by line type
const moodDurations = {
  Emergency: { calm: 5, impatient: 5, frustrated: 3, angry: 2, complaining: 1 },
  Express: { calm: 15, impatient: 15, frustrated: 10, angry: 5, complaining: 2 },
  Normal: { calm: 30, impatient: 30, frustrated: 20, angry: 10, complaining: 3 },
  Priority: { calm: 8, impatient: 7, frustrated: 5, angry: 3, complaining: 1 }
};
```

### Consultant Shift Logic
```typescript
if (currentTime >= shiftStart && currentTime <= shiftEnd) {
  status = 'available';
} else {
  status = 'closed';
}
```

## Data Flow

1. **Player Action**: Swap tiles on board
2. **Match Check**: Algorithms detect valid matches
3. **Dispensing**: Matched meds added to patient records
4. **Completion Check**: Patient status updated if all meds dispensed
5. **Scoring**: Points calculated based on completion, speed, sentiment
6. **Time Update**: Global time advances, affecting all timers
7. **Consultant Update**: Status and assignments updated
8. **UI Refresh**: All components reflect current state

This interconnected system creates a dynamic pharmacy simulation where player actions have cascading effects on patients, consultants, and scoring.