import { useAppSelector, useAppDispatch } from "../store/hooks";
import { activateTimeFreeze } from "../store";

function SpecialsBar() {
  const dispatch = useAppDispatch();
  const comboMeter = useAppSelector(({ candyCrush: { comboMeter } }) => comboMeter);
  const maxCombo = useAppSelector(({ candyCrush: { maxCombo } }) => maxCombo);
  const currentManager = useAppSelector(({ game: { currentManager } }) => currentManager);

  const handleActivate = () => {
    if (currentManager?.specialAbility?.unlocked) {
      if (currentManager.specialAbility.name === 'Time Freeze') {
        dispatch(activateTimeFreeze());
      }
      // Add other abilities here
    }
  };

  return (
    <div className="flex flex-col space-y-4 p-2 bg-gray-100 rounded-lg shadow-md w-32 h-fit">
      {/* Combo Meter */}
      <div>
        <h4 className="text-sm font-bold text-center">Combo Meter</h4>
        <div className="w-full bg-gray-200 rounded-full h-4">
          <div className="bg-blue-500 h-4 rounded-full transition-all duration-300" style={{ width: `${(comboMeter / maxCombo) * 100}%` }}></div>
        </div>
        <p className="text-xs text-center mt-1">{comboMeter}/{maxCombo}</p>
      </div>

      {/* Special Ability */}
      {currentManager?.specialAbility && (
        <div className="bg-white p-2 rounded-lg shadow-sm border">
          <h4 className="text-sm font-bold text-center">Special Ability</h4>
          <p className="text-xs font-semibold">{currentManager.specialAbility.name}</p>
          <p className="text-xs text-gray-600 mb-2">{currentManager.specialAbility.description}</p>
          {currentManager.specialAbility.unlocked ? (
            <button 
              onClick={handleActivate}
              className="w-full text-xs bg-green-500 hover:bg-green-600 text-white px-2 py-1 rounded transition-colors"
            >
              Activate
            </button>
          ) : (
            <p className="text-xs text-gray-500 text-center">Locked</p>
          )}
        </div>
      )}
    </div>
  );
}

export default SpecialsBar;