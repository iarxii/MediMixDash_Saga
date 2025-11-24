Ov# **MediMixDash Saga – Implementation Plan**

## **Overview**
This plan outlines the steps to implement the enhanced gameplay mechanics for MediMixDash Saga, including prescription orders, morale system, scoring, and shift-based currency.

## **Current Status**
- **Completed:**
  - Prescription System: Patient data structure, Redux slices (patients, game), basic dispense logic, UI with progress bars, thumbnails, avatars, and timers.
  - UI Updates: Patients component fully implemented. Background carousel implemented.
  - Redux Store: Extended with game slice (dashPoints, morale, currency, shiftTime) and patients slice.
- **Partially Implemented:**
  - Morale System: State exists, but speed-based updates and effects not implemented.
  - Scoring & Currency: State exists, but point awarding and end-of-shift calculation not implemented.
  - Shift Timer: State and decrement logic exist, but end-shift logic and reset not implemented.
- **Pending:**
  - Over/under-dispensing penalties.
  - Morale effects on future patients.
  - HUD for displaying metrics.
  - Board highlighting for active prescriptions.
  - Shift management and summary.

## **1. Core Components to Implement**

### **1.1 Prescription System**
- **Patient Data Structure:**
  - Extend Patient interface: `{ id, name, prescription: { [medName: string]: number }, dispensed: { [medName: string]: number }, waitTime, maxWaitTime, status }`
  - Example: `{ prescription: { "Gelux": 5, "Pillora": 2, "Injecta": 1 } }`

- **Order Fulfillment Logic:**
  - Track dispensed meds per patient. **Status: Implemented**
  - On match: Update patient's dispensed count for that med. **Status: Implemented**
  - Check completion: When all required meds are >= order amounts. **Status: Implemented**
  - Over-dispensing: If dispensed > order, apply -1 Dash Points per extra pill. **Status: Pending**
  - Under-dispensing: On timer expiry, if not complete, -5 Dash Points +1 Complaint. **Status: Pending**

### **1.2 Morale System**
- **Global Morale State:** Add to Redux store: `morale: number` (0-100), `compliments: number`, `complaints: number` **Status: Implemented**
- **Dispensing Speed Calculation:**
  - Track time from patient arrival to fulfillment. **Status: Pending**
  - Fast: < 50% of waitTime → +1 Compliment, morale +10 **Status: Pending**
  - Slow: > 80% of waitTime → +1 Complaint, morale -10 **Status: Pending**
- **Effects:**
  - High Morale (>70): Future patients get +5s to timers **Status: Pending**
  - Low Morale (<30): Future patients get -5s to timers **Status: Pending**

### **1.3 Scoring & Currency**
- **Dash Points:** Redux state `dashPoints: number` **Status: Implemented**
  - +10 per successful dispense **Status: Pending**
  - -1 per over-dispensed pill **Status: Pending**
  - -5 per failed order **Status: Pending**
- **Currency:** Redux state `currency: number` **Status: Implemented**
  - Earned at end of shift: base 100 + (fulfilledOrders * 20) + (morale / 10) **Status: Pending**
- **Shift Timer:** 5-minute countdown (configurable) **Status: Partially Implemented (decrement logic exists)**
  - On expiry: Calculate final currency, reset for next shift **Status: Pending**

## **2. UI Updates**

### **2.1 Patients Component**
- Display prescription details: "5 Gelux, 2 Pillora, 1 Injecta" **Status: Implemented**
- Progress bars per med: Show dispensed vs required **Status: Implemented**
- Status indicators: Waiting, Dispensing, Completed, Failed **Status: Implemented**

### **2.2 Pharmacy Board**
- Highlight matches that contribute to active prescriptions **Status: Pending**
- Visual feedback on dispense (e.g., particles or animations) **Status: Pending**

### **2.3 HUD**
- Top bar: Dash Points, Currency, Morale Meter, Shift Timer **Status: Pending**
- Morale Meter: Progress bar with compliments/complaints count **Status: Pending**

## **3. Game Flow**

### **3.1 Patient Lifecycle**
1. Patient arrives with random prescription **Status: Implemented**
2. Timer starts counting down **Status: Implemented**
3. Player matches meds → updates dispensed counts **Status: Implemented**
4. On completion: +Dash Points, update morale, remove patient, add new patient **Status: Partially (completion check done, points/morale pending)**
5. On timeout: Penalty, +Complaint, remove patient, add new patient **Status: Partially (status update done, penalty pending)**

### **3.2 Shift Management**
- Start shift: Reset timer, currency, patients **Status: Pending**
- During shift: Accumulate Dash Points, fulfill orders **Status: Partially (accumulate pending)**
- End shift: Calculate currency, display summary **Status: Pending**

## **4. Technical Implementation**

### **4.1 Redux Store Updates**
- Add slices: patients, morale, scoring, shift **Status: Implemented (patients, game slices added)**
- Actions: dispenseMed, completeOrder, failOrder, updateMorale, endShift **Status: Partially (dispenseMed, updateMorale actions exist, others pending)**

### **4.2 Component Architecture**
- Patients: List with individual PatientCard components **Status: Implemented**
- PatientCard: Displays order, progress, timer **Status: Implemented**
- Board: Integrate dispense logic on match **Status: Implemented**
- App: Manage shift timer, global state **Status: Partially (timers managed, shift end pending)**

### **4.3 Configuration**
- Global config file: shiftDuration, moraleThresholds, pointValues **Status: Pending**
- Easy to tweak for balancing

## **5. Testing & Balancing**
- Unit tests for dispense logic, morale calculations
- Playtesting: Adjust timers, point values for fun factor
- Edge cases: Over-dispensing, multiple patients, shift end

## **6. Future Enhancements**
- Power-ups tied to morale
- Daily challenges with special prescriptions
- Leaderboards for high scores/currency

## **7. Timeline**
- **Completed:** Prescription system and basic dispense logic, UI updates for Patients component, Redux store extensions.
- **Immediate (Next Sprint):** Implement over/under-dispensing penalties, morale speed calculations and effects, scoring point awarding on completion/failure.
- **Week 2:** Add HUD for Dash Points, Currency, Morale Meter, Shift Timer. Implement board highlighting for active prescriptions.
- **Week 3:** Full shift management with end-shift currency calculation and summary.
- **Week 4:** Testing, balancing, polish, and future enhancements.