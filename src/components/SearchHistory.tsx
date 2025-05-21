import { SearchHistoryItem } from "../types/weather";
import { useWeatherStore } from "../store/weatherStore";

interface SearchHistoryProps {
  history: SearchHistoryItem[];
  onSelectCity: (city: string) => void;
  setSearchHistory: () => void;
}

export default function SearchHistory({
  history,
  onSelectCity,
  setSearchHistory,
}: SearchHistoryProps) {
  const { removeFromSearchHistory } = useWeatherStore();

  const handleDeleteHistory = (timestamp: number) => {
    // Delete using Zustand store
    removeFromSearchHistory(timestamp);
  };

  return (
    <div>
      <div className="flex items-center mb-4">
        <h2 className="text-lg font-medium">Search History</h2>
        {history.length > 0 && (
          <button
            className="ml-auto text-xs text-blue-300 hover:text-blue-200 bg-gray-700/60 hover:bg-gray-700/80 px-2 py-1 rounded-md transition-colors"
            onClick={setSearchHistory}
          >
            Clear All
          </button>
        )}
      </div>

      {history.length > 0 ? (
        <ul className="space-y-2">
          {history.map((item) => (
            <li
              key={item.timestamp}
              className="flex items-center justify-between p-3 bg-gray-700/60 rounded-lg border border-gray-600/50 hover:bg-gray-700/80 transition-colors group"
            >
              <button
                className="flex-grow text-left flex items-center text-gray-200 group-hover:text-blue-300 transition-colors truncate mr-2"
                onClick={() => onSelectCity(item.city)}
              >
                <span className="font-medium truncate">{item.city}</span>
              </button>
              <div className="flex items-center">
                <button
                  className="text-xs p-1 rounded-md transition-colors bg-gray-700 text-gray-400 hover:bg-gray-600 hover:text-white"
                  onClick={() => handleDeleteHistory(item.timestamp)}
                  title="Delete from history"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-3.5 w-3.5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <div className="text-center py-6 bg-gray-700/40 rounded-lg border border-gray-600/30">
          <svg
            className="w-12 h-12 mx-auto text-gray-500 mb-2"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="1"
              d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <p className="text-gray-400 text-sm">No search history yet</p>
          <p className="text-gray-500 text-xs mt-1">
            Your recent searches will appear here
          </p>
        </div>
      )}
    </div>
  );
}
