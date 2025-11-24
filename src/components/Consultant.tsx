import { useAppDispatch, useAppSelector } from "../store/hooks";
import { assignConsultantOrder, setHighlighted } from "../store";
import { findValidMoves } from "../utils/findValidMoves";

interface ConsultantProps {
  consultant: {
    id: number;
    name: string;
    available: boolean;
    stamina: number;
    status: 'available' | 'fetching' | 'busy' | 'closed';
    shiftStart: number;
    shiftEnd: number;
    currentOrder: number | null;
  };
  index: number;
}

function Consultant({ consultant, index }: ConsultantProps) {
  const dispatch = useAppDispatch();
  const board = useAppSelector(({ candyCrush: { board } }) => board);
  const boardSize = useAppSelector(({ candyCrush: { boardSize } }) => boardSize);

  const handleCallForHelp = () => {
    if (consultant.status === 'available') {
      const validMoves = findValidMoves(board, boardSize);
      dispatch(setHighlighted(validMoves));
      // Optionally, set status to busy or something
    }
  };

  const colors = [
    "bg-blue-200",
    "bg-green-200",
    "bg-yellow-200",
    "bg-purple-200",
    "bg-pink-200",
  ];

  return (
    <div className="flex items-center space-x-2 bg-gray-50 p-2 rounded">
      <div
        className={`w-8 h-8 ${colors[index]} rounded-full flex items-center justify-center text-sm font-bold text-gray-700`}
      >
        {consultant.name[0]}
      </div>
      <div className="flex-1">
        <div className="text-sm font-semibold">{consultant.name}</div>
        <div className="text-xs text-gray-600">
          {consultant.status === 'available' ? '✅' : consultant.status === 'fetching' ? '🔄' : consultant.status === 'busy' ? '🏃‍♂️' : '🚪'} {consultant.status}
        </div>
        <div className="text-xs text-gray-500">Stamina: {consultant.stamina}%</div>
      </div>
      <button
        onClick={handleCallForHelp}
        disabled={consultant.status !== 'available'}
        className="px-2 py-1 bg-blue-500 text-white text-xs rounded hover:bg-blue-600 disabled:bg-gray-300"
      >
        🆘 Help
      </button>
    </div>
  );
}

export default Consultant;