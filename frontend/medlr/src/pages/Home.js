import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api";

const Home = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [medicines, setMedicines] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [autocompleteSuggestions, setAutocompleteSuggestions] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchMedicines = async () => {
      try {
        setLoading(true);
        const { data } = await API.get("/medicines");
        setMedicines(data);
        setError(null);
      } catch (error) {
        console.error("Error fetching medicines:", error);
        setError(error.response?.data?.message || "Failed to load medicines");
      } finally {
        setLoading(false);
      }
    };

    const fetchFavorites = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          console.log("No token found in localStorage");
          return;
        }

        const { data } = await API.get("/users/favorites", {
          headers: { Authorization: `Bearer ${token}` },
        });
        console.log("Favorites Data:", data);

        const favoriteMedicines = await Promise.all(
          data.map(async (id) => {
            const response = await API.get(`/medicines/${id}`);
            return response.data;
          })
        );

        setFavorites(favoriteMedicines);
      } catch (error) {
        console.error("Error fetching favorites:", error);
        setError(error.response?.data?.message || "Failed to load favorites");
      }
    };

    fetchMedicines();
    fetchFavorites();
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?query=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const handleSearchChange = (e) => {
    const query = e.target.value;
    setSearchQuery(query);

    if (query.trim()) {
      const filteredSuggestions = medicines.filter((medicine) =>
        medicine.name.toLowerCase().includes(query.toLowerCase())
      );
      setAutocompleteSuggestions(filteredSuggestions);
    } else {
      setAutocompleteSuggestions([]);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-4">
      <h1 className="text-4xl font-bold text-gray-900 mb-6">PharmaCompare</h1>

      <form onSubmit={handleSearch} className="w-full max-w-md mb-8">
        <div className="relative flex gap-2">
          <input
            type="text"
            value={searchQuery}
            onChange={handleSearchChange}
            placeholder="Search for medicines..."
            className="flex-1 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <button
            type="submit"
            className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition-colors"
          >
            Search
          </button>

          {autocompleteSuggestions.length > 0 && searchQuery.trim() && (
            <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-300 rounded-lg shadow-lg z-10">
              <ul>
                {autocompleteSuggestions.map((medicine) => (
                  <li
                    key={medicine._id}
                    onClick={() => {
                      setSearchQuery(medicine.name);
                      navigate(`/medicine/${medicine._id}`);
                      setAutocompleteSuggestions([]);
                    }}
                    className="cursor-pointer p-2 hover:bg-gray-100"
                  >
                    {medicine.name}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </form>

      <div className="w-full max-w-2xl">
        <h2 className="text-2xl font-semibold text-gray-700 mb-4">
          Available Medicines
        </h2>
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          {loading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto"></div>
              <p className="mt-2 text-gray-600">Loading medicines...</p>
            </div>
          ) : error ? (
            <div className="text-center py-8">
              <p className="text-red-500">{error}</p>
              <button
                onClick={() => window.location.reload()}
                className="mt-4 text-blue-500 hover:underline"
              >
                Try Again
              </button>
            </div>
          ) : medicines.length === 0 ? (
            <div className="text-center py-8 text-gray-600">
              No medicines available
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {medicines.map((medicine) => (
                <div
                  key={medicine._id}
                  className="p-4 hover:bg-gray-50 transition-colors"
                >
                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className="text-lg font-medium text-gray-900">
                        {medicine.name}
                      </h3>
                      <p className="text-sm text-gray-600">
                        {medicine.description}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-semibold text-gray-900">
                        ₹{medicine.price}
                      </p>
                      <button
                        onClick={() => navigate(`/medicine/${medicine._id}`)}
                        className="mt-2 text-sm text-blue-500 hover:underline"
                      >
                        View Details
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {favorites.length > 0 && (
        <div className="fixed bottom-5 right-5 bg-white shadow-xl rounded-full p-4 flex flex-col items-center">
          <h4 className="text-lg font-semibold text-gray-700 mb-2">
            Favorites
          </h4>
          <div className="space-y-2">
            {favorites.slice(0, 5).map((medicine) => (
              <div
                key={medicine._id}
                className="text-sm text-gray-800 cursor-pointer"
                onClick={() => navigate(`/medicine/${medicine._id}`)}
              >
                {medicine.name}{" "}
              </div>
            ))}
            {favorites.length > 5 && (
              <div
                className="text-sm text-blue-500 cursor-pointer"
                onClick={() => navigate("/favorites")}
              >
                See All
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;
