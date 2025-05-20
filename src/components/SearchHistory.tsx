import { SearchHistoryItem } from "../types/weather";

interface SearchHistoryProps {
  history: SearchHistoryItem[];
  onSelectCity: (city: string) => void;
}

export default function SearchHistory({
  history,
  onSelectCity,
}: SearchHistoryProps) {
  if (!history.length) return null;

  return (
    <div className="w-full max-w-md mt-6">
      <h3 className="text-md font-medium text-gray-700 mb-3 flex items-center">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5 mr-2 text-gray-500"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
        Recent Searches
      </h3>
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <ul className="divide-y divide-gray-100">
          {history.map((item) => (
            <li
              key={item.timestamp}
              className="hover:bg-gray-50 transition-colors duration-150"
            >
              <button
                onClick={() => onSelectCity(item.city)}
                className="w-full px-4 py-3 text-left text-gray-800 flex items-center"
              >
                <span className="flex-1 font-medium">{item.city}</span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4 text-gray-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M14 5l7 7m0 0l-7 7m7-7H3"
                  />
                </svg>
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
