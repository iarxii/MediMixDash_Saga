# MediMixDash Saga Game Logic and Algorithms

## Overview
MediMixDash Saga is a pharmacy management simulation game with match-3 mechanics for dispensing medications. The game integrates real-time patient management, consultant assistance, scoring systems, and pharmacy management with rotating managers and special abilities.

## Core Components

### 1. Board Game Mechanics
The main gameplay revolves around a match-3 board where players swap medication tiles to create matches of 3 or more identical items.

#### Match Detection Algorithm
- **Horizontal Matching**: Scans each row for consecutive identical tiles (≥3)
- **Vertical Matching**: Scans each column for consecutive identical tiles (≥3)
- **Automatic Match Highlighting**: When board updates create natural matches, tiles are automatically highlighted with red pulsing borders for 2 seconds
- **Free Helper System**: Players receive visual feedback when matches occur naturally during board gravity/refill operations
- **Match Removal**: Identified matches are removed, triggering gravity and refill
- **Dispensing Logic**: Matched tiles correspond to medications dispensed to patients

#### Valid Move Detection
The `findValidMoves` function identifies all possible swaps that would create valid matches:
- Iterates through all board positions
- Tests swapping with adjacent tiles (right and down)
- Simulates the swap and checks for new matches
- Returns array of tile indices that are part of valid moves

#### Smart Rearrangement Algorithm
The `findSmartRearrangements` function provides intelligent tile rearrangement for consultants:
- **Cluster Detection**: Identifies groups of 2+ similar tiles within a 2-tile radius using BFS
- **Optimal Swaps**: Evaluates potential rearrangements to maximize future match opportunities
- **Scoring System**: Rates rearrangements based on match potential after swap (horizontal/vertical matches)
- **Strategic Moves**: Returns top 5 highest-value rearrangements for consultants to execute
- **Fallback Logic**: Falls back to basic valid moves when no smart rearrangements are available

#### Row Wave Animation
- **Wave Effect**: Tiles animate with a bouncing motion in sequence from top-left to bottom-right
- **Animation Delay**: Each tile has a 0.1-second delay based on its position (`delay = (row * cols + col) * 0.1`)
- **Duration**: 2.5 seconds per cycle, infinite loop
- **CSS Keyframes**: `waveBounce` animation moves tiles up and down by 8px

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
- **Emergency**: Calm(10s) → Impatient(10s) → Frustrated(6s) → Angry(4s) → Complaining(2s)
- **Express**: Calm(30s) → Impatient(30s) → Frustrated(20s) → Angry(10s) → Complaining(4s)
- **Normal**: Calm(60s) → Impatient(60s) → Frustrated(40s) → Angry(20s) → Complaining(6s)
- **Priority**: Calm(16s) → Impatient(14s) → Frustrated(10s) → Angry(6s) → Complaining(2s)

#### Queue Management
- **Emergency Line**: 20 seconds max wait (highest priority)
- **Express Line**: 60 seconds max wait
- **Normal Line**: 120 seconds max wait
- **Priority Line**: 30 seconds max wait
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
- **Call for Help Button**: Triggers highlighting of valid moves on the board with red pulsing animation and thick rounded borders
- **Tiered Help System**:
  - **1 Consultant**: Highlight valid moves (10 seconds) - red pulsing borders
  - **2 Consultants**: Highlight + smart rearrangement every 2.5 seconds (20 seconds) - green flash animation for matched tiles
  - **3+ Consultants**: Highlight + smart rearrangement every 2 seconds + reduced stamina cost (10 seconds)
- **Smart Rearrangement**: For 2+ consultants, uses `findSmartRearrangements` to identify optimal tile swaps that create better match opportunities by rearranging tiles within proximity radius
- **Continuous Auto-Matching**: For 2+ consultants, optimal rearrangements are automatically performed at regular intervals throughout the help duration
- **Highlight Algorithm**: Uses `findValidMoves` to identify swappable tiles
- **Auto-Match**: Automatically performs a valid swap with green flash animation
- **Visual Feedback**: Different animations for help highlighting (red) vs auto-matching (green) vs smart rearrangement (purple glow)
- **Popup Notifications**: Creative popup messages appear when consultants start and finish helping
- **Button States**: Button changes color and text when consultants are actively helping ("🧠 Optimizing...")
- **Screen Overlay**: Subtle blue overlay with animated indicators when consultants are working
- **Cooldown System**: 30-second cooldown after help ends, stamina cost reduction for team efforts

#### Patient Assignment
- Automatic assignment when patient status changes to 'dispensing'
- Finds first available consultant
- Updates both patient and consultant records

### 4. Scoring and Points System

#### Base Scoring
- **Patient Completion**: +50 points, +$10 currency, +5% morale, +1 compliment
- **Patient Failure**: -30 points, -10% morale, +1 complaint
- **Speed Bonus**: Additional points for completing orders quickly
- **Combo System**: Multiplier bonuses for consecutive completions

#### Sentiment Penalties
- **Complaint Lodged**: 3% deduction from current dash points
- **Patient Leaves**: 10% deduction from current dash points (3% chance when complaining timer expires)
- Penalties applied immediately when mood state changes

#### Game Over
- Points reach 0 or below
- Start with 100 grace points

### 5. Statistics and Performance Tracking

#### Core Statistics
- **Total Patients**: Cumulative count of all patients processed
- **Completed Patients**: Successfully fulfilled prescriptions
- **Failed Patients**: Patients who left due to timeout or complaints
- **Completion Rate**: Percentage of patients successfully served
- **Failure Rate**: Percentage of patients who were not served
- **Average Wait Time**: Mean time patients spend in queue

#### Financial Metrics
- **Currency**: Earned through successful patient completions
- **Dash Points**: Core scoring system with penalties for failures

#### Satisfaction Metrics
- **Compliments**: Count of positive feedback from satisfied patients
- **Complaints**: Count of negative feedback from dissatisfied patients
- **Morale**: Team satisfaction percentage (0-100%)

#### Real-time Updates
Statistics update in real-time as patients are completed or fail:
- Patient completion triggers: +stats, +points, +currency, +morale, +compliment
- Patient failure triggers: +stats, -points, -morale, +complaint
- Average calculations update dynamically with each new patient

### 5. Time Management

#### Global Time
- Real-time progression (1 second = 4 game seconds for faster gameplay)
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

### 6. Management System

#### Manager Roles
- **Day Shift Pharmacy Managers**: Dr. Sarah Mitchell, Dr. Michael Chen
- **Night Shift Pharmacy Manager**: Dr. Emily Rodriguez
- **Rotation**: Automatic shift-based rotation between available managers
- **Stamina System**: Managers have stamina that affects performance (0-100%)

#### Special Abilities
Managers unlock special abilities based on milestones:
- **Time Freeze** (Dr. Sarah Mitchell): Freeze all patient timers for 10 seconds
  - *Requirement*: Complete 50 patients without complaints
- **Consultant Boost** (Dr. Michael Chen): Double consultant speed for 30 seconds
  - *Requirement*: Maintain 95%+ patient satisfaction for 24 hours
- **Emergency Mode** (Dr. Emily Rodriguez): Automatically prioritize emergency patients
  - *Requirement*: Handle 25 emergency cases successfully

#### Manager Statistics
- **Complaints Tracking**: Real-time count of patient complaints
- **Patient Retention**: Track patients who left due to poor service
- **Performance Metrics**: Stamina levels and ability unlocks
- **Satisfaction Monitoring**: Compliments vs complaints ratio
- **Financial Overview**: Currency earned and dash points accumulated

#### Statistics UI Component
The Statistics component provides a comprehensive dashboard displaying:
- **Score & Currency**: Primary game metrics prominently displayed
- **Patient Statistics**: Total, completed, failed counts with completion/failure rates
- **Performance Metrics**: Average wait time and processing efficiency
- **Satisfaction Dashboard**: Compliments, complaints, and team morale
- **Real-time Updates**: All metrics update live as the game progresses

#### Enhanced Waiting Patients Display
The "Waiting Patients" header shows comprehensive performance metrics:
- **Current vs Total Queued**: Shows active patients vs total patients that entered the system
- **Completed Count**: Patients successfully served with full medication orders (successful dispensed)
- **Failed Count**: Patients that left without full medication orders
- **Pending Count**: Patients currently in system (waiting or being dispensed)
- **Success Rate**: Percentage of patients successfully completed (Successful Dispensed / Total Patients Processed)
- **Total Time Taken**: Session duration since game start, displayed as:
  - Seconds: when under 60 seconds (e.g., "45s")
  - Minutes and seconds: when under 60 minutes (e.g., "12m 30s")
  - Hours and minutes: when 60+ minutes (e.g., "2h 15m")
- **Performance Rating**: 
  - 0-30%: Poor (red)
  - 31-60%: Slow (yellow)
  - 61-90%: Picking up the pace (blue)
  - 91-100%: Excellent performance (green)
  - >100%: Error (red)

## Data Flow

1. **Player Action**: Swap tiles on board
2. **Match Check**: Algorithms detect valid matches
3. **Dispensing**: Matched meds added to patient records
4. **Completion Check**: Patient status updated if all meds dispensed
5. **Statistics Update**: Real-time metrics tracking for performance monitoring
6. **Scoring**: Points calculated based on completion, speed, sentiment
7. **Time Update**: Global time advances, affecting all timers
8. **Consultant Update**: Status and assignments updated
9. **Manager Update**: Current manager rotates based on shift, stamina depletes
10. **UI Refresh**: All components reflect current state including comprehensive statistics

This interconnected system creates a dynamic pharmacy simulation where player actions have cascading effects on patients, consultants, managers, and scoring.