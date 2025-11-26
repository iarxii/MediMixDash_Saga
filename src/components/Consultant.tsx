import { useAppDispatch, useAppSelector } from "../store/hooks";
import { setHighlighted, startConsultantHelp, endConsultantHelp, dragEnd, setAutoMatched } from "../store";
import { findValidMoves } from "../utils/findValidMoves";
import { findSmartRearrangements } from "../utils/findValidMoves";

interface ConsultantProps {
  consultant: {
    id: number;
    name: string;
    available: boolean;
    stamina: number;
    status: 'available' | 'fetching' | 'busy' | 'closed' | 'helping';
    shiftStart: number;
    shiftEnd: number;
    currentOrder: number | null;
    helpCooldown?: number;
  };
  index: number;
}

function Consultant({ consultant, index }: ConsultantProps) {
  const dispatch = useAppDispatch();
  const board = useAppSelector(({ candyCrush: { board } }) => board);
  const boardSize = useAppSelector(({ candyCrush: { boardSize } }) => boardSize);
  const consultants = useAppSelector(({ game: { consultants } }) => consultants);
  const helpingCount = consultants.filter(c => c.status === 'helping').length;

  const performAutoMatch = (validMoves: number[]) => {
    const firstValidIndex = validMoves[0];
    if (firstValidIndex !== undefined) {
      const col = firstValidIndex % boardSize;
      
      // Try to swap with right neighbor first
      if (col < boardSize - 1) {
        const rightIndex = firstValidIndex + 1;
        const mockDraggedElement = { getAttribute: () => firstValidIndex.toString() };
        const mockReplacedElement = { getAttribute: () => rightIndex.toString() };
        
        // Highlight the tiles being auto-matched
        dispatch(setAutoMatched([firstValidIndex, rightIndex]));
        
        // Set up the drag state
        dispatch({ type: 'candyCrush/dragStart', payload: mockDraggedElement });
        dispatch({ type: 'candyCrush/dragDrop', payload: mockReplacedElement });
        dispatch(dragEnd());
        
        // Clear highlight after a brief moment
        setTimeout(() => {
          dispatch(setAutoMatched([]));
        }, 1000);
      }
    }
  };

  const performSmartMatch = (smartRearrangements: { fromIndex: number; toIndex: number; value: number }[]) => {
    if (smartRearrangements.length > 0) {
      const bestRearrangement = smartRearrangements[0];
      const mockDraggedElement = { getAttribute: () => bestRearrangement.fromIndex.toString() };
      const mockReplacedElement = { getAttribute: () => bestRearrangement.toIndex.toString() };

      // Highlight the tiles being smart-matched
      dispatch(setAutoMatched([bestRearrangement.fromIndex, bestRearrangement.toIndex]));

      // Set up the drag state
      dispatch({ type: 'candyCrush/dragStart', payload: mockDraggedElement });
      dispatch({ type: 'candyCrush/dragDrop', payload: mockReplacedElement });
      dispatch(dragEnd());

      // Clear highlight after a brief moment
      setTimeout(() => {
        dispatch(setAutoMatched([]));
      }, 1000);
    }
  };

  const handleCallForHelp = () => {
    if (consultant.status === 'available' && !consultant.helpCooldown) {
      const currentHelpingCount = helpingCount;
      const totalHelpingCount = currentHelpingCount + 1; // Include this consultant
      
      dispatch(startConsultantHelp(consultant.id));
      
      const validMoves = findValidMoves(board, boardSize);
      dispatch(setHighlighted(validMoves));
      
      // Different help behaviors based on consultant count
      let helpDuration = 10000; // 10 seconds base
      let autoMatchInterval: NodeJS.Timeout | null = null;
      
      if (totalHelpingCount >= 3) {
        // 3+ consultants: Highlight + smart rearrangement + reduced stamina cost
        helpDuration = 10000; // 10 seconds help
        // Start smart rearrangement for maximum efficiency
        autoMatchInterval = setInterval(() => {
          const smartRearrangements = findSmartRearrangements(board, boardSize);
          if (smartRearrangements.length > 0) {
            performSmartMatch(smartRearrangements);
          } else {
            const currentValidMoves = findValidMoves(board, boardSize);
            if (currentValidMoves.length > 0) {
              performAutoMatch(currentValidMoves);
            }
          }
        }, 2000);
      } else if (totalHelpingCount >= 2) {
        // 2 consultants: Highlight + smart rearrangement
        helpDuration = 20000; // 20 seconds help
        // Start smart rearrangement
        autoMatchInterval = setInterval(() => {
          const smartRearrangements = findSmartRearrangements(board, boardSize);
          if (smartRearrangements.length > 0) {
            performSmartMatch(smartRearrangements);
          } else {
            const currentValidMoves = findValidMoves(board, boardSize);
            if (currentValidMoves.length > 0) {
              performAutoMatch(currentValidMoves);
            }
          }
        }, 2500); // Slightly slower for strategic moves
      } else {
        // 1 consultant: Just highlight
        helpDuration = 10000; // 10 seconds help
      }
      
      setTimeout(() => {
        // Clear the auto-match interval if it exists
        if (autoMatchInterval) {
          clearInterval(autoMatchInterval);
        }
        dispatch(endConsultantHelp(consultant.id));
        dispatch(setHighlighted([])); // Clear highlighting when help ends
      }, helpDuration);
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
          {consultant.status === 'available' ? '✅' : consultant.status === 'fetching' ? '🔄' : consultant.status === 'busy' ? '🏃‍♂️' : consultant.status === 'helping' ? '🆘' : '🚪'} {consultant.status}
        </div>
        <div className="text-xs text-gray-500">Stamina: {consultant.stamina}%</div>
      </div>
      <button
        onClick={handleCallForHelp}
        disabled={consultant.status !== 'available' || !!consultant.helpCooldown}
        className="px-2 py-1 bg-blue-500 text-white text-xs rounded-lg hover:bg-blue-600 disabled:bg-gray-300"
      >
        {consultant.helpCooldown ? `⏳ ${consultant.helpCooldown}s` : consultant.status === 'helping' ? `🆘 Helping (${helpingCount})` : `🆘 Help (${helpingCount} active)`}
      </button>
    </div>
  );
}

export default Consultant;