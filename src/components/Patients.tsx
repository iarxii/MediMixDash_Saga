import { useEffect } from "react";
import { useAppSelector } from "../store/hooks";
import { medImages } from "../utils/candyData";

interface Patient {
  id: number;
  name: string;
  prescription: { [med: string]: number };
  dispensed: { [med: string]: number };
  waitTime: number;
  maxWaitTime: number;
  status: 'waiting' | 'dispensing' | 'completed' | 'failed';
}

function Patients() {
  const patients = useAppSelector((state) => state.patients) as Patient[];

  const renderPrescription = (prescription: { [med: string]: number }, dispensed: { [med: string]: number }) => {
    return Object.entries(prescription).map(([med, req]) => {
      const disp = dispensed[med] || 0;
      return (
        <div key={med} className="flex items-center space-x-2 mb-2">
          <img src={medImages[med]} alt={med} className="w-8 h-8 rounded" />
          <div className="flex-1">
            <div className="text-sm font-semibold">{med}: {disp}/{req}</div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                style={{ width: `${Math.min(100, (disp / req) * 100)}%` }}
              ></div>
            </div>
          </div>
        </div>
      );
    });
  };

  return (
    <div className="space-y-4">
      {patients.map(patient => (
        <div key={patient.id} className={`bg-white p-4 rounded-lg shadow-lg border-2 ${patient.status === 'completed' ? 'border-green-500' : patient.status === 'failed' ? 'border-red-500' : 'border-blue-300'}`}>
          <div className="flex items-center space-x-3 mb-3">
            <div className="w-12 h-12 bg-gray-300 rounded-full flex items-center justify-center text-lg font-bold text-gray-700">
              {patient.name[0]}
            </div>
            <div>
              <span className="text-lg font-bold text-gray-800">{patient.name}</span>
              <span className={`ml-2 px-2 py-1 text-xs rounded-full ${patient.status === 'completed' ? 'bg-green-100 text-green-800' : patient.status === 'failed' ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800'}`}>
                {patient.status}
              </span>
            </div>
          </div>
          <div className="mb-3">
            {renderPrescription(patient.prescription, patient.dispensed)}
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3">
            <div
              className={`h-3 rounded-full transition-all duration-1000 ${patient.waitTime > 10 ? 'bg-green-500' : patient.waitTime > 5 ? 'bg-yellow-500' : 'bg-red-500'}`}
              style={{ width: `${(patient.waitTime / patient.maxWaitTime) * 100}%` }}
            ></div>
          </div>
          <div className="text-center mt-2 text-sm font-semibold">{patient.waitTime}s left</div>
        </div>
      ))}
    </div>
  );
}

export default Patients;