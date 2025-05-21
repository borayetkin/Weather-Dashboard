import { useState, FormEvent, useEffect, useRef, useCallback } from "react";
import { getSuggestions } from "../utils/weatherUtils";

interface SearchBarProps {
  onSearch: (city: string) => void;
  isLoading: boolean;
}

export default function SearchBar({ onSearch, isLoading }: SearchBarProps) {
  const [city, setCity] = useState("");
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const suggestionsRef = useRef<HTMLDivElement>(null);

  // Memoize the search function to prevent recreation
  const handleSearch = useCallback(
    (searchCity: string) => {
      if (searchCity.trim()) {
        // Immediately hide suggestions first
        setShowSuggestions(false);
        // Clear suggestions array to ensure no rendering happens
        setSuggestions([]);
        // Set the city value
        setCity(searchCity);
        // Execute search
        onSearch(searchCity.trim());
      }
    },
    [onSearch]
  );

  // Update suggestions when city input changes
  useEffect(() => {
    const updateSuggestions = () => {
      if (city.trim().length >= 1) {
        const cityMatches = getSuggestions(city);
        setSuggestions(cityMatches);
        setShowSuggestions(cityMatches.length > 0);
      } else {
        setSuggestions([]);
        setShowSuggestions(false);
      }
    };

    // Debounce updates to suggestions for better performance
    const timer = setTimeout(updateSuggestions, 150);
    return () => clearTimeout(timer);
  }, [city]);

  // Handle clicks outside the component
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        suggestionsRef.current &&
        !suggestionsRef.current.contains(event.target as Node) &&
        inputRef.current &&
        !inputRef.current.contains(event.target as Node)
      ) {
        setShowSuggestions(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    handleSearch(city);
  };

  const handleSuggestionClick = (suggestion: string) => {
    // Use the memoized search function to ensure consistent behavior
    handleSearch(suggestion);
  };

  return (
    <form onSubmit={handleSubmit} className="w-full">
      <div className="relative w-full">
        <div className="flex items-center overflow-hidden bg-gray-800/40 backdrop-blur-lg rounded-lg border border-gray-600/30 focus-within:ring-2 focus-within:ring-blue-400/80 focus-within:border-gray-400/40 transition-all duration-300 shadow-lg">
          <div className="pl-3 text-gray-300">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>
          <input
            ref={inputRef}
            type="text"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            onFocus={() => {
              // Only show suggestions if there's input text
              if (city.trim().length >= 1) {
                const cityMatches = getSuggestions(city);
                setSuggestions(cityMatches);
                setShowSuggestions(cityMatches.length > 0);
              }
            }}
            placeholder="Search city..."
            className="w-full px-3 py-3 focus:outline-none text-white placeholder-gray-300/90 bg-transparent font-medium"
            disabled={isLoading}
            autoComplete="off"
            aria-label="Search for a city"
          />
          <button
            type="submit"
            className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white font-medium px-5 py-3 transition-all duration-200 disabled:from-blue-700/40 disabled:to-indigo-700/40 disabled:text-white/50 cursor-pointer"
            disabled={isLoading || !city.trim()}
            aria-label="Search"
          >
            {isLoading ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            ) : (
              <span>Search</span>
            )}
          </button>
        </div>

        {/* Suggestions dropdown with improved transitions */}
        {showSuggestions && suggestions.length > 0 && (
          <div
            ref={suggestionsRef}
            className="absolute z-10 w-full mt-1 bg-gray-800/95 backdrop-blur-lg rounded-lg shadow-xl max-h-60 overflow-auto border border-gray-600/30 animate-fadeIn"
            role="listbox"
            aria-label="City suggestions"
          >
            <ul className="py-1">
              {suggestions.map((suggestion, index) => (
                <li
                  key={index}
                  className="px-4 py-3 hover:bg-indigo-500/30 cursor-pointer flex items-center text-gray-100 border-b border-gray-700/30 last:border-0 transition-all duration-150"
                  onClick={() => handleSuggestionClick(suggestion)}
                  role="option"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      handleSuggestionClick(suggestion);
                    }
                  }}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4 mr-3 text-blue-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                  </svg>
                  <span className="font-medium">{suggestion}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </form>
  );
}
