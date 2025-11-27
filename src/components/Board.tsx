import { useAppSelector } from "../store/hooks";
import Tile from "./Tile";
import SpecialsBar from "./SpecialsBar";

function Board() {
  const board: string[] = useAppSelector(({ candyCrush: { board } }) => board);
  const boardSize: number = useAppSelector(
    ({ candyCrush: { boardSize } }) => boardSize
  );
  return (
    <div className="flex flex-col lg:flex-row items-center lg:items-start space-y-4 lg:space-y-0 lg:space-x-4">
      <div className="med-board mb-4 border-2 border-pink-400 rounded-lg p-2 bg-white shadow-md">
        <div
        className="w-full max-h-[80vh] rounded-lg"
        style={{
          display: 'grid',
          gridTemplateColumns: `repeat(${boardSize}, 1fr)`,
          gridTemplateRows: `repeat(${boardSize}, 1fr)`,
          aspectRatio: '1 / 1', // Maintain square aspect ratio
          maxHeight: '60vh',
          width: '100%',
          gap: '10px', // Consistent gap between tiles
        }}
        >
        {board.map((candy: string, index: number) => (
          <Tile candy={candy} key={index} candyId={index} />
        ))}
        </div>
      </div>
      <SpecialsBar />
    </div>
  );
}

export default Board;
