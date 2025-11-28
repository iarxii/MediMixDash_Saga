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

  // Touch event handlers for mobile support
  const handleTouchStart = (e: React.TouchEvent) => {
    e.preventDefault();
    dispatch(dragStart(e.target));
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    e.preventDefault(); // Prevent scrolling
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    e.preventDefault();
    // For touch, we need to find the element at the touch position
    const touch = e.changedTouches[0];
    const elementAtPoint = document.elementFromPoint(touch.clientX, touch.clientY);
    if (elementAtPoint && elementAtPoint.hasAttribute('candy-id')) {
      dispatch(dragDrop(elementAtPoint));
    }
    dispatch(dragEnd());
  };

  // Determine tile visual state
  const isHighlighted = highlighted.includes(candyId);
  const isAutoMatched = autoMatched.includes(candyId);
  const isSmartRearranged = isAutoMatched; // For now, use same visual for smart rearrangements

  return (
    <div
      className={`w-full h-full flex justify-center items-center rounded-lg select-none tile-wave-bounce ${
        isHighlighted && !isAutoMatched ? 'tile-consultant-pulse' : ''
      } ${
        isAutoMatched ? 'tile-auto-match' : ''
      } ${
        isSmartRearranged && !isAutoMatched ? 'tile-smart-rearrange' : ''
      }`}
      style={{
        boxShadow: "inset 5px 5px 15px #889ffaff,inset -5px -5px 15px #aaaab7bb, 0 4px 8px rgba(0,0,0,0.15)",
        animationDelay: `${delay}s`,
        touchAction: 'none', // Prevent default touch behaviors
      }}
      onClick={handleClick}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {candy && (
        <img
          src={medImages[candy]}
          alt={candy}
          className={`rounded-lg w-full h-full object-contain tile-hover-grow ${isPulsing ? 'tile-pulse' : ''}`}
          draggable={true}
          onDragStart={(e) => dispatch(dragStart(e.target))}
          onDragOver={(e) => e.preventDefault()}
          onDragEnter={(e) => e.preventDefault()}
          onDragLeave={(e) => e.preventDefault()}
          onDrop={(e) => dispatch(dragDrop(e.target))}
          onDragEnd={() => dispatch(dragEnd())}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          candy-id={candyId}
        />
      )}
    </div>
  );
}

export default Tile;
