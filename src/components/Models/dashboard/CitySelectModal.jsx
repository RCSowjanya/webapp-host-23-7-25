import React, { useEffect, useState } from "react";
import { IoClose } from "react-icons/io5";

const CitySelectModal = ({ isOpen, onClose, onSubmit }) => {
  const [cities, setCities] = useState([]);
  const [selectedCity, setSelectedCity] = useState("all");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (isOpen) {
      setLoading(true);
      setError(null);
      fetch("/api/property-list")
        .then((res) => res.json())
        .then((data) => {
          if (Array.isArray(data?.data)) {
            // Extract unique cities from property.address.city
            const citySet = new Set();
            data.data.forEach((property) => {
              const city = property.address?.city;
              if (city) citySet.add(city);
            });
            setCities(Array.from(citySet));
          } else {
            setCities([]);
            setError(data?.error || "Failed to load cities");
          }
        })
        .catch(() => setError("Failed to load cities"))
        .finally(() => setLoading(false));
    }
  }, [isOpen]);

  const handleCitySelect = (city) => {
    setSelectedCity(city);
  };

  const handleReset = () => {
    setSelectedCity("all");
  };

  const handleSubmit = () => {
    if (selectedCity === "all") {
      onSubmit("all");
    } else {
      onSubmit(selectedCity);
    }
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-lg w-full max-w-sm mx-4 overflow-y-auto max-h-[80vh]">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-[#5940C8]">Select Cities</h2>
          <div className="flex items-center gap-4">
            <button
              onClick={handleReset}
              className="text-orange-500 hover:text-orange-600 cursor-pointer transition-colors font-medium"
            >
              RESET
            </button>
            
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          {loading && <div className="text-center py-4">Loading...</div>}
          {error && (
            <div className="text-center text-red-500 py-4">{error}</div>
          )}
          {!loading && !error && (
            <div className="space-y-3">
              {cities.length === 0 && (
                <div className="text-center text-gray-500">
                  No cities found.
                </div>
              )}
              
              {/* All Cities Option */}
              <div
                className="flex items-center justify-between py-3 px-4 rounded-lg transition-colors cursor-pointer"
                style={{
                  background: selectedCity === "all" ? "#F4F8FF" : "transparent",
                }}
                onClick={() => handleCitySelect("all")}
              >
                <div className="flex flex-col">
                  <span className="text-sm font-medium text-gray-800">All Cities</span>
                </div>
                <input
                  type="radio"
                  name="city"
                  checked={selectedCity === "all"}
                  onChange={() => handleCitySelect("all")}
                  className="w-4 h-4 text-[#5940C8] cursor-pointer focus:ring-[#5940C8] border-gray-300"
                />
              </div>

              {/* Individual Cities */}
              {cities.map((city) => (
                <div
                  key={city}
                  className="flex items-center justify-between py-3 px-4 rounded-lg transition-colors cursor-pointer"
                  style={{
                    background: selectedCity === city ? "#F4F8FF" : "transparent",
                  }}
                  onClick={() => handleCitySelect(city)}
                >
                  <div className="flex flex-col">
                    <span className="text-sm font-medium text-gray-800">{city}</span>
                  </div>
                  <input
                    type="radio"
                    name="city"
                    checked={selectedCity === city}
                    onChange={() => handleCitySelect(city)}
                    className="w-4 h-4 text-[#5940C8] cursor-pointer focus:ring-[#5940C8] border-gray-300"
                  />
                </div>
              ))}
            </div>
          )}

          {/* Submit Button */}
          <div className="text-center pt-6">
            <button
              onClick={handleSubmit}
              disabled={!selectedCity}
              className="w-full px-8 py-3 bg-[#25A4E8] cursor-pointer text-white rounded-lg transition-colors font-medium text-sm disabled:opacity-50"
            >
              Submit
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CitySelectModal;
