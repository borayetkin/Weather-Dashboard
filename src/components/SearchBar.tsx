import { useState, FormEvent, useEffect, useRef } from "react";
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

  useEffect(() => {
    // Update suggestions when city input changes
    if (city.trim().length >= 1) {
      const cityMatches = getSuggestions(city);
      setSuggestions(cityMatches);
      setShowSuggestions(cityMatches.length > 0);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  }, [city]);

  useEffect(() => {
    // Close suggestions on click outside
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
    setShowSuggestions(false);
    if (city.trim()) {
      onSearch(city.trim());
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    // Set city and hide suggestions
    setCity(suggestion);
    setShowSuggestions(false);

    // Trigger search
    onSearch(suggestion);
  };

  return (
    <form onSubmit={handleSubmit} className="w-full">
      <div className="relative w-full">
        <div className="flex items-center overflow-hidden bg-gray-600/40 backdrop-blur-sm rounded-lg border border-gray-500/30 focus-within:ring-2 focus-within:ring-blue-400/50 focus-within:border-gray-400/40 transition-all duration-300 shadow-md">
          <div className="pl-3 text-gray-200">
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
              if (city.trim().length >= 1) {
                const cityMatches = getSuggestions(city);
                setSuggestions(cityMatches);
                setShowSuggestions(cityMatches.length > 0);
              }
            }}
            placeholder="Search city..."
            className="w-full px-3 py-3 focus:outline-none text-white placeholder-gray-300/70 bg-transparent font-medium"
            disabled={isLoading}
            autoComplete="off"
          />
          <button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-5 py-3 transition-all duration-200 disabled:bg-blue-700/40 disabled:text-white/50 cursor-pointer"
            disabled={isLoading || !city.trim()}
          >
            {isLoading ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            ) : (
              <span>Search</span>
            )}
          </button>
        </div>

        {/* Suggestions dropdown */}
        {showSuggestions && suggestions.length > 0 && (
          <div
            ref={suggestionsRef}
            className="absolute z-10 w-full mt-1 bg-gray-700/95 backdrop-blur-sm rounded-lg shadow-lg max-h-60 overflow-auto border border-gray-500/30 animate-fadeIn"
          >
            <ul className="py-1">
              {suggestions.map((suggestion, index) => (
                <li
                  key={index}
                  className="px-4 py-3 hover:bg-blue-500/30 cursor-pointer flex items-center text-gray-100 border-b border-gray-600/30 last:border-0 transition-all duration-150"
                  onClick={() => handleSuggestionClick(suggestion)}
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
