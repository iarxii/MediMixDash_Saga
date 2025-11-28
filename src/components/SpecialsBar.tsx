import { useAppSelector, useAppDispatch } from "../store/hooks";
import { activateTimeFreeze, activateConsultantBoost, activateEmergencyMode } from "../store";

function SpecialsBar() {
  const dispatch = useAppDispatch();
  const comboMeter = useAppSelector(({ candyCrush: { comboMeter } }) => comboMeter);
  const maxCombo = useAppSelector(({ candyCrush: { maxCombo } }) => maxCombo);
  const managers = useAppSelector(({ game: { managers } }) => managers);

  const handleActivate = (abilityName: string) => {
    if (abilityName === 'Time Freeze') {
      dispatch(activateTimeFreeze());
    } else if (abilityName === 'Consultant Boost') {
      dispatch(activateConsultantBoost());
    } else if (abilityName === 'Emergency Mode') {
      dispatch(activateEmergencyMode());
    }
    // Add other abilities here
  };

  return (
    <div className="bg-gradient-to-br from-pink-50 to-purple-50 border-2 border-pink-400 flex flex-col space-y-4 p-2 bg-gray-100 rounded-lg shadow-md w-full lg:w-32 h-fit max-h-[60vh] mb-4z" style={{padding: '10px !important'}}>
      {/* Combo Meter */}
      <div>
        <h4 className="text-sm font-bold text-center">Combo Meter</h4>
        <div className="w-full bg-gray-200 rounded-full h-4">
          <div className="bg-blue-500 h-4 rounded-full transition-all duration-300" style={{ width: `${(comboMeter / maxCombo) * 100}%` }}></div>
        </div>
        <p className="text-xs text-center mt-1">{comboMeter}/{maxCombo}</p>
      </div>

      {/* Special Abilities */}
      <div className="bg-white p-2 rounded-lg shadow-sm border">
        <h4 className="text-sm font-bold text-center mb-2">Special Abilities</h4>
        <div className="lg:space-y-2 lg:max-h-[30vh] lg:overflow-y-auto flex flex-row space-x-2 overflow-x-auto lg:flex-col lg:space-x-0 lg:overflow-x-visible">
          {managers.map(manager => (
            manager.specialAbility && (
              <div key={manager.id} className="border-t lg:border-t pt-2 first:border-t-0 first:pt-0 flex-shrink-0 min-w-[120px] lg:min-w-0">
                <p className="text-xs font-semibold">{manager.specialAbility.name}</p>
                <p className="text-xs text-gray-600 mb-1">{manager.specialAbility.description}</p>
                {manager.specialAbility.unlocked ? (
                  <button 
                    onClick={() => handleActivate(manager.specialAbility!.name)}
                    className="w-full text-xs bg-green-500 hover:bg-green-600 text-white px-2 py-1 rounded transition-colors"
                  >
                    Activate
                  </button>
                ) : (
                  <p className="text-xs text-gray-500 text-center">Locked</p>
                )}
              </div>
            )
          ))}
        </div>
      </div>
    </div>
  );
}

export default SpecialsBar;