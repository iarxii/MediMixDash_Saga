Ov# **MediMixDash Saga – Implementation Plan**

## **Overview**
This plan outlines the steps to implement the enhanced gameplay mechanics for MediMixDash Saga, including prescription orders, morale system, scoring, and shift-based currency.

## **1. Core Components to Implement**

### **1.1 Prescription System**
- **Patient Data Structure:**
  - Extend Patient interface: `{ id, name, prescription: { [medName: string]: number }, waitTime, maxWaitTime, status }`
  - Example: `{ prescription: { "Gelux": 5, "Pillora": 2, "Injecta": 1 } }`

- **Order Fulfillment Logic:**
  - Track dispensed meds per patient.
  - On match: Update patient's dispensed count for that med.
  - Check completion: When all required meds are >= order amounts.
  - Over-dispensing: If dispensed > order, apply -1 Dash Points per extra pill.
  - Under-dispensing: On timer expiry, if not complete, -5 Dash Points +1 Complaint.

### **1.2 Morale System**
- **Global Morale State:** Add to Redux store: `morale: number` (0-100), `compliments: number`, `complaints: number`
- **Dispensing Speed Calculation:**
  - Track time from patient arrival to fulfillment.
  - Fast: < 50% of waitTime → +1 Compliment, morale +10
  - Slow: > 80% of waitTime → +1 Complaint, morale -10
- **Effects:**
  - High Morale (>70): Future patients get +5s to timers
  - Low Morale (<30): Future patients get -5s to timers

### **1.3 Scoring & Currency**
- **Dash Points:** Redux state `dashPoints: number`
  - +10 per successful dispense
  - -1 per over-dispensed pill
  - -5 per failed order
- **Currency:** Redux state `currency: number`
  - Earned at end of shift: base 100 + (fulfilledOrders * 20) + (morale / 10)
- **Shift Timer:** 5-minute countdown (configurable)
  - On expiry: Calculate final currency, reset for next shift

## **2. UI Updates**

### **2.1 Patients Component**
- Display prescription details: "5 Gelux, 2 Pillora, 1 Injecta"
- Progress bars per med: Show dispensed vs required
- Status indicators: Waiting, Dispensing, Completed, Failed

### **2.2 Pharmacy Board**
- Highlight matches that contribute to active prescriptions
- Visual feedback on dispense (e.g., particles or animations)

### **2.3 HUD**
- Top bar: Dash Points, Currency, Morale Meter, Shift Timer
- Morale Meter: Progress bar with compliments/complaints count

## **3. Game Flow**

### **3.1 Patient Lifecycle**
1. Patient arrives with random prescription
2. Timer starts counting down
3. Player matches meds → updates dispensed counts
4. On completion: +Dash Points, update morale, remove patient, add new patient
5. On timeout: Penalty, +Complaint, remove patient, add new patient

### **3.2 Shift Management**
- Start shift: Reset timer, currency, patients
- During shift: Accumulate Dash Points, fulfill orders
- End shift: Calculate currency, display summary

## **4. Technical Implementation**

### **4.1 Redux Store Updates**
- Add slices: patients, morale, scoring, shift
- Actions: dispenseMed, completeOrder, failOrder, updateMorale, endShift

### **4.2 Component Architecture**
- Patients: List with individual PatientCard components
- PatientCard: Displays order, progress, timer
- Board: Integrate dispense logic on match
- App: Manage shift timer, global state

### **4.3 Configuration**
- Global config file: shiftDuration, moraleThresholds, pointValues
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
- Week 1: Implement prescription system and basic dispense logic
- Week 2: Add morale system and UI updates
- Week 3: Scoring, currency, shift management
- Week 4: Testing, balancing, polish