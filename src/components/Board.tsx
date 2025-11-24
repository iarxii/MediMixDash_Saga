import { useAppSelector } from "../store/hooks";
import Tile from "./Tile";

function Board() {
  const board: string[] = useAppSelector(({ candyCrush: { board } }) => board);
  const boardSize: number = useAppSelector(
    ({ candyCrush: { boardSize } }) => boardSize
  );
  return (
    <div className="med-board">
      <div
        className="flex flex-wrap rounded-lg"
        style={{
          width: `${6.25 * boardSize}rem`,
          // width: '80%',
        }}
      >
        {board.map((candy: string, index: number) => (
          <Tile candy={candy} key={index} candyId={index} />
        ))}
      </div>
    </div>

  );
}

export default Board;
