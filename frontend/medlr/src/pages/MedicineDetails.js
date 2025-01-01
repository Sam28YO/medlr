import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import API from "../api";

const MedicineDetails = () => {
  const { id } = useParams();
  const [medicine, setMedicine] = useState(null);
  const [pharmacies, setPharmacies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isFavorite, setIsFavorite] = useState(false);

  useEffect(() => {
    const fetchMedicineDetails = async () => {
      try {
        const [medicineRes, pharmaciesRes] = await Promise.all([
          API.get(`/medicines/${id}`),
          API.get("/pharmacies", { params: { medicineId: id } }),
        ]);

        setMedicine(medicineRes.data);
        setPharmacies(pharmaciesRes.data);
        checkFavorite(medicineRes.data._id);
      } catch (error) {
        setError("Failed to fetch medicine details");
      } finally {
        setLoading(false);
      }
    };

    fetchMedicineDetails();
  }, [id]);

  const checkFavorite = async (medicineId) => {
    const token = localStorage.getItem("token");

    if (!token) {
      console.log("No token found in localStorage.");
      setIsFavorite(false);
      return;
    }

    try {
      const response = await API.get("/users/favorites", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      console.log("Favorites response:", response.data);

      if (Array.isArray(response.data)) {
        if (response.data.includes(medicineId)) {
          console.log(`Medicine with ID ${medicineId} is in favorites.`);
          setIsFavorite(true);
        } else {
          console.log(`Medicine with ID ${medicineId} is not in favorites.`);
          setIsFavorite(false);
        }
      } else {
        console.error("Favorites response is not an array.");
        setIsFavorite(false);
      }
    } catch (error) {
      console.error("Error fetching favorites:", error);
      setIsFavorite(false);
    }
  };

  const handleFavoriteToggle = async (medicineId) => {
    const token = localStorage.getItem("token");

    if (!token) {
      alert("No token found. Please log in.");
      return;
    }

    try {
      if (isFavorite) {
        await API.delete(`/users/favorites/${medicineId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setIsFavorite(false);
        alert("Removed from favorites!");
      } else {
        await API.post(
          `/users/favorites/${medicineId}`,
          {},
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setIsFavorite(true);
        alert("Added to favorites!");
      }
    } catch (error) {
      console.error("Error toggling favorites:", error.response?.data);
      alert("Failed to update favorites. Please try again.");
    }
  };

  if (loading) return <div className="text-center mt-10">Loading...</div>;
  if (error)
    return <div className="text-red-500 text-center mt-10">{error}</div>;
  if (!medicine)
    return <div className="text-center mt-10">Medicine not found</div>;

  return (
    <div className="container mx-auto mt-10 px-4">
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-3xl font-bold mb-4">{medicine.name}</h2>
        <p className="text-gray-700 mb-4">{medicine.description}</p>
        <div className="mb-6">
          <h3 className="text-xl font-semibold mb-3">
            Price: ₹{medicine.price}
          </h3>
          <button
            onClick={() => handleFavoriteToggle(medicine._id)}
            className={`${
              isFavorite ? "bg-red-500" : "bg-blue-500"
            } text-white px-4 py-2 rounded hover:bg-${
              isFavorite ? "red-600" : "blue-600"
            }`}
          >
            {isFavorite ? "Remove from Favorites" : "Add to Favorites"}
          </button>
        </div>

        <div className="mt-8">
          <h3 className="text-2xl font-semibold mb-4">
            Available at These Pharmacies
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {pharmacies.map((pharmacy) => (
              <div
                key={pharmacy._id}
                className="border rounded-lg p-4 hover:shadow-md transition-shadow"
              >
                <h4 className="font-semibold mb-2">{pharmacy.name}</h4>
                <p className="text-gray-600">{pharmacy.location}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MedicineDetails;
