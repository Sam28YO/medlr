import React, { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import API from "../api";

const SearchResults = () => {
  const [searchParams] = useSearchParams();
  const [results, setResults] = useState([]);
  const [error, setError] = useState("");
  const query = searchParams.get("query") || "";
  const navigate = useNavigate();

  useEffect(() => {
    const fetchSearchResults = async () => {
      try {
        const { data } = await API.get(`/medicines?name=${query}`);
        setResults(data);
      } catch (err) {
        setError("Failed to fetch search results. Please try again.");
        console.error(err);
      }
    };

    if (query) {
      fetchSearchResults();
    }
  }, [query]);

  return (
    <div className="container mx-auto mt-10">
      <h2 className="text-3xl font-bold mb-6">Search Results for "{query}"</h2>
      {error && <p className="text-red-500 mb-4">{error}</p>}
      {results.length === 0 && !error ? (
        <p className="text-gray-700">No results found for "{query}".</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {results.map((medicine) => (
            <div
              key={medicine._id}
              className="p-4 bg-white shadow-lg rounded-lg"
            >
              <h3 className="text-xl font-bold mb-2">{medicine.name}</h3>
              <p className="text-gray-600 mb-4">{medicine.description}</p>
              <p className="text-gray-700 font-semibold mb-4">
                Price: ₹{medicine.price}
              </p>
              <button
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                onClick={() => navigate(`/medicine/${medicine._id}`)}
              >
                View Details
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SearchResults;
