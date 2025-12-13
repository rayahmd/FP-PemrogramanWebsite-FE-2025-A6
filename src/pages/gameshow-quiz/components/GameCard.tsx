import { useNavigate } from "react-router-dom";

const GameCard = ({ game }: any) => {
  const navigate = useNavigate();

  return (
    <div
      className="border p-4 rounded cursor-pointer"
      onClick={() => navigate(`/gameshow-quiz/play/${game.id}`)}
    >
      <h3 className="font-bold">{game.name}</h3>
      <p>{game.description}</p>
    </div>
  );
};

export default GameCard;
