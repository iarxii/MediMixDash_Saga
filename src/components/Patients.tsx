import { useAppSelector } from "../store/hooks";
import { medImages } from "../utils/candyData";
import { medsModalities, modalityColors } from "../utils/patientData";
import { Patient } from "../utils/patientGenerator";

function Patients() {
  const patients = useAppSelector((state) => state.patients) as Patient[];

  // Sort patients by pinned desc, then by id descending (newest first)
  const sortedPatients = [...patients].sort((a, b) => {
    if (a.pinned && !b.pinned) return -1;
    if (!a.pinned && b.pinned) return 1;
    return b.id - a.id;
  });

  // Group by line type and sort each group: pinned first, then by id descending (newest first)
  const expressPatients = sortedPatients.filter(p => p.lineType === 'Express').sort((a, b) => {
    if (a.pinned && !b.pinned) return -1;
    if (!a.pinned && b.pinned) return 1;
    return b.id - a.id;
  });
  const normalPatients = sortedPatients.filter(p => p.lineType === 'Normal').sort((a, b) => {
    if (a.pinned && !b.pinned) return -1;
    if (!a.pinned && b.pinned) return 1;
    return b.id - a.id;
  });
  const priorityPatients = sortedPatients.filter(p => p.lineType === 'Priority').sort((a, b) => {
    if (a.pinned && !b.pinned) return -1;
    if (!a.pinned && b.pinned) return 1;
    return b.id - a.id;
  });
  const emergencyPatients = sortedPatients.filter(p => p.lineType === 'Emergency').sort((a, b) => {
    if (a.pinned && !b.pinned) return -1;
    if (!a.pinned && b.pinned) return 1;
    return b.id - a.id;
  });

  const renderPrescription = (prescription: { [med: string]: number }, dispensed: { [med: string]: number }) => {
    return Object.entries(prescription).map(([med, req]) => {
      const disp = dispensed[med] || 0;
      const modality = medsModalities[med];
      const color = modalityColors[modality] || 'gray';
      return (
        <div key={med} className="flex items-center space-x-2 mb-2">
          <img src={medImages[med]} alt={med} className="w-8 h-8 rounded" />
          <div className="flex-1">
            <div className="text-sm font-semibold">{med}: {disp}/{req} ({modality})</div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className={`h-2 rounded-full transition-all duration-300 bg-${color}-500`}
                style={{ width: `${Math.min(100, (disp / req) * 100)}%` }}
              ></div>
            </div>
          </div>
        </div>
      );
    });
  };

  const renderPatientCard = (patient: Patient) => (
    <div key={patient.id} className={`bg-white p-3 rounded-lg shadow-lg border-2 min-w-[300px] mr-4 ${patient.status === 'completed' ? 'border-green-500' : patient.status === 'failed' ? 'border-red-500' : 'border-blue-300'}`}>
      <div className="flex items-center space-x-3 mb-3">
        <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center text-lg font-bold text-gray-700">
          {patient.name[0]}
        </div>
        <div className="flex-1">
          <div className="flex items-center justify-between">
            <span className="text-lg font-bold text-gray-800">{patient.name}</span>
            <span className="text-sm font-semibold bg-blue-100 px-2 py-1 rounded">#{patient.ticketNumber}</span>
          </div>
          <div className="flex items-center space-x-2 mt-1">
            <span className="text-sm text-gray-600">Age: {patient.age}</span>
            <span className={`text-sm ${
              patient.moodStatus === 'calm' ? 'text-green-600' :
              patient.moodStatus === 'impatient' ? 'text-yellow-600' :
              patient.moodStatus === 'frustrated' ? 'text-orange-600' :
              patient.moodStatus === 'angry' ? 'text-red-600' :
              patient.moodStatus === 'complaining' ? 'text-purple-600' :
              patient.moodStatus === 'complaint lodged' ? 'text-red-800' :
              'text-gray-600'
            }`}>
              {patient.moodStatus === 'calm' ? '😊' : 
               patient.moodStatus === 'impatient' ? '😐' : 
               patient.moodStatus === 'frustrated' ? '😟' : 
               patient.moodStatus === 'angry' ? '😠' : 
               patient.moodStatus === 'complaining' ? '😤' : 
               patient.moodStatus === 'complaint lodged' ? '📞' :
               '👋'} {patient.moodStatus}
            </span>
          </div>
          <span className={`px-2 py-1 text-xs rounded-full ${patient.status === 'completed' ? 'bg-green-100 text-green-800' : patient.status === 'failed' ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800'}`}>
            {patient.status}
          </span>
        </div>
      </div>
      <div className="mb-3">
        {renderPrescription(patient.prescription, patient.dispensed)}
      </div>
      <div className="w-full bg-gray-200 rounded-full h-3">
        <div
          className={`h-3 rounded-full transition-all duration-1000 ${
            patient.moodStatus === 'calm' ? 'bg-green-500' :
            patient.moodStatus === 'impatient' ? 'bg-yellow-500' :
            patient.moodStatus === 'frustrated' ? 'bg-orange-500' :
            patient.moodStatus === 'angry' ? 'bg-red-500' :
            patient.moodStatus === 'complaining' ? 'bg-purple-500' :
            'bg-gray-500'
          }`}
          style={{ width: `${patient.status === 'waiting' ? (patient.moodTimer / patient.moodStateDuration) * 100 : 100}%` }}
        ></div>
      </div>
      <div className="text-center mt-2 text-sm font-semibold">
        {patient.status === 'waiting' ? `${patient.moodTimer}s in ${patient.moodStatus}` : patient.status}
      </div>
    </div>
  );

  return (
    <div className="space-y-6 mb-6">
      {/* Emergency Line */}
      <div className="bg-red-200 bg-opacity-70 p-3 rounded-lg border-2 border-red-400">
        <h3 className="text-lg font-bold mb-2 text-red-800">🚨 Emergency Line</h3>
        <div className="overflow-x-auto pb-2 custom-scrollbar">
          <div className="flex space-x-4">
            {emergencyPatients.length > 0 ? emergencyPatients.map(renderPatientCard) : (
              <div className="text-gray-500 italic">No emergency patients</div>
            )}
          </div>
        </div>
      </div>

      {/* Express Line */}
      <div className="bg-green-100 bg-opacity-50 p-3 rounded-lg border-2 border-green-400">
        <h3 className="text-lg font-bold mb-2 text-green-700">Express Line</h3>
        <div className="overflow-x-auto pb-2 custom-scrollbar">
          <div className="flex space-x-4">
            {expressPatients.length > 0 ? expressPatients.map(renderPatientCard) : (
              <div className="text-gray-500 italic">No patients in express line</div>
            )}
          </div>
        </div>
      </div>

      {/* Normal Line */}
      <div className="bg-blue-100 bg-opacity-50 p-3 rounded-lg border-2 border-blue-400">
        <h3 className="text-lg font-bold mb-2 text-blue-700">Normal Line</h3>
        <div className="overflow-x-auto pb-2 custom-scrollbar">
          <div className="flex space-x-4">
            {normalPatients.length > 0 ? normalPatients.map(renderPatientCard) : (
              <div className="text-gray-500 italic">No patients in normal line</div>
            )}
          </div>
        </div>
      </div>

      {/* Priority Line */}
      <div className="bg-red-100 bg-opacity-50 p-3 rounded-lg border-2 border-red-400">
        <h3 className="text-lg font-bold mb-2 text-red-700">Priority Line</h3>
        <div className="overflow-x-auto pb-2 custom-scrollbar">
          <div className="flex space-x-4">
            {priorityPatients.length > 0 ? priorityPatients.map(renderPatientCard) : (
              <div className="text-gray-500 italic">No patients in priority line</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Patients;