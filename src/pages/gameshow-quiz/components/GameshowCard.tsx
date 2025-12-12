import { Link } from 'react-router-dom';
import { Button } from './Button';

interface GameshowCardProps {
  game: {
    id: string;
    name: string;
    description: string;
    thumbnail_image?: string;
  };
}

export const GameshowCard = ({ game }: GameshowCardProps) => {
  return (
    <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-transform transform hover:-translate-y-1 flex flex-col">
      {game.thumbnail_image && (
        <img src={game.thumbnail_image} alt={game.name} className="w-full h-44 object-cover" />
      )}

      <div className="p-4 flex-1 flex flex-col">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">{game.name}</h3>
        <p className="text-sm text-gray-600 dark:text-gray-300 mb-4 line-clamp-3">{game.description}</p>

        <div className="mt-auto flex gap-2">
          <Link to={`/gameshow/${game.id}`} className="flex-1">
            <Button variant="primary" className="w-full">Detail</Button>
          </Link>
          <Link to={`/gameshow/${game.id}/play`} className="flex-1">
            <Button variant="success" className="w-full">Play</Button>
          </Link>
          <Link to={`/gameshow/${game.id}/edit`} className="flex-1">
            <Button variant="warning" className="w-full">Edit</Button>
          </Link>
        </div>
      </div>
    </div>
  );
};