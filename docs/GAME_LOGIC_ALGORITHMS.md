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
Patients' mood deteriorates based on remaining wait time percentage:
- 80%+: Calm 😊
- 60-80%: Impatient 😐
- 40-60%: Frustrated 😟
- 20-40%: Angry 😠
- 10-20%: Complaining 😤
- <10%: Complaint Lodged 📞

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
- Deductions applied based on patient mood at various stages
- Major deduction for lodged complaints

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
const timeRatio = waitTime / maxWaitTime;
if (timeRatio > 0.8) mood = 'calm';
// ... progressive worsening
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