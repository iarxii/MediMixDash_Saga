import { useState } from "react";
import { dragDrop, dragEnd, dragStart } from "../store";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { medImages } from "../utils/candyData";

function Tile({ candy, candyId }: { candy: string; candyId: number }) {
  const dispatch = useAppDispatch();
  const [isPulsing, setIsPulsing] = useState(false);
  const boardSize = useAppSelector(({ candyCrush: { boardSize } }) => boardSize);
  const highlighted = useAppSelector(({ candyCrush: { highlighted } }) => highlighted);
  const autoMatched = useAppSelector(({ candyCrush: { autoMatched } }) => autoMatched);
  const cols = boardSize;
  const row = Math.floor(candyId / cols);
  const col = candyId % cols;
  const delay = (row * cols + col) * 0.1;

  const handleClick = () => {
    setIsPulsing(true);
    setTimeout(() => setIsPulsing(false), 300);
  };

  // Determine tile visual state
  const isHighlighted = highlighted.includes(candyId);
  const isAutoMatched = autoMatched.includes(candyId);
  const isSmartRearranged = isAutoMatched; // For now, use same visual for smart rearrangements

  return (
    <div
      className={`h-24 w-24 flex justify-center items-center m-0.5 rounded-lg select-none tile-wave-bounce ${
        isHighlighted ? 'tile-consultant-pulse' : ''
      } ${
        isAutoMatched ? 'tile-auto-match' : ''
      } ${
        isSmartRearranged && !isAutoMatched ? 'tile-smart-rearrange' : ''
      }`}
      style={{
        boxShadow: "inset 5px 5px 15px #889ffaff,inset -5px -5px 15px #aaaab7bb, 0 4px 8px rgba(0,0,0,0.15)",
        animationDelay: `${delay}s`,
      }}
      onClick={handleClick}
    >
      {candy && (
        <img
          src={medImages[candy]}
          alt={candy}
          className={`h-20 w-20 tile-hover-grow ${isPulsing ? 'tile-pulse' : ''}`}
          draggable={true}
          onDragStart={(e) => dispatch(dragStart(e.target))}
          onDragOver={(e) => e.preventDefault()}
          onDragEnter={(e) => e.preventDefault()}
          onDragLeave={(e) => e.preventDefault()}
          onDrop={(e) => dispatch(dragDrop(e.target))}
          onDragEnd={() => dispatch(dragEnd())}
          candy-id={candyId}
        />
      )}
    </div>
  );
}

export default Tile;
