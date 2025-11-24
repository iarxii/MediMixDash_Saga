import { useState } from "react";
import { dragDrop, dragEnd, dragStart } from "../store";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { medImages } from "../utils/candyData";

function Tile({ candy, candyId }: { candy: string; candyId: number }) {
  const dispatch = useAppDispatch();
  const [isPulsing, setIsPulsing] = useState(false);
  const boardSize = useAppSelector(({ candyCrush: { boardSize } }) => boardSize);
  const highlighted = useAppSelector(({ candyCrush: { highlighted } }) => highlighted);
  const cols = boardSize;
  const row = Math.floor(candyId / cols);
  const col = candyId % cols;
  const delay = (row * cols + col) * 0.1;

  const handleClick = () => {
    setIsPulsing(true);
    setTimeout(() => setIsPulsing(false), 300);
  };

  return (
    <div
      className={`h-24 w-24 flex justify-center items-center m-0.5 rounded-lg select-none tile-wave-bounce ${highlighted.includes(candyId) ? 'tile-consultant-pulse' : ''}`}
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
