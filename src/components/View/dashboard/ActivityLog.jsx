"use client";
import { FaRegCalendarAlt } from "react-icons/fa";
import { FiFilter } from "react-icons/fi";
import {
  MdOutlineEdit,
  MdOutlineHome,
  MdOutlineSync,
  MdOutlineErrorOutline,
  MdOutlineNotifications,
  MdOutlinePerson,
  MdOutlineArrowUpward,
  MdOutlineAccountCircle,
  MdOutlineHouse,
  MdOutlineCalendarToday,
  MdOutlineReceipt,
  MdOutlineLock,
  MdOutlineLocalOffer,
  MdOutlineClose,
} from "react-icons/md";
import { BsCalendar2Plus } from "react-icons/bs";
import { IoMdArrowDropdown } from "react-icons/io";
import React, { useState, useEffect } from "react";

const filterIdToApiValue = {
  account: "Account",
  listings: "Listing",
  channel: "Channel",
  reservation: "Reservation",
  subscriptions: "Subscription",
  smartlock: "Smartlock",
  rateplan: "Rateplan",
  payout: "Payout"
};

// Example date range presets
const dateRangePresets = [
  { id: "7d", label: "Last 7 days" },
  { id: "1m", label: "Last 1 month" },
  { id: "3m", label: "Last 3 months" },
  { id: "6m", label: "Last 6 months" },
  { id: "1y", label: "Last 1 year" },
  { id: "custom", label: "Custom" }
];

const getDateRange = (preset) => {
  const end = new Date();
  let start = new Date();
  switch (preset) {
    case "7d":
      start.setDate(end.getDate() - 7);
      break;
    case "1m":
      start.setMonth(end.getMonth() - 1);
      break;
    case "3m":
      start.setMonth(end.getMonth() - 3);
      break;
    case "6m":
      start.setMonth(end.getMonth() - 6);
      break;
    case "1y":
      start.setFullYear(end.getFullYear() - 1);
      break;
    default:
      break;
  }
  return {
    startDate: start.toISOString(),
    endDate: end.toISOString()
  };
};

const ActivityLog = () => {
  const [selectedFilterId, setSelectedFilterId] = useState(""); // "" means no filter
  const [dateRangePreset, setDateRangePreset] = useState("7d"); // default to last 7 days
  const [customRange, setCustomRange] = useState({ startDate: "", endDate: "" });
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);

  // Fetch activities whenever filter or date range changes
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      let startDate, endDate;
      if (dateRangePreset === "custom" && customRange.startDate && customRange.endDate) {
        startDate = customRange.startDate;
        endDate = customRange.endDate;
      } else {
        const range = getDateRange(dateRangePreset);
        startDate = range.startDate;
        endDate = range.endDate;
      }
      if (!startDate || !endDate) {
        setError("Please select a valid date range.");
        setLoading(false);
        return;
      }
      try {
        const apiFilter = filterIdToApiValue[selectedFilterId] || undefined;
        const activities = await fetchAllUserActivity({
          startDate,
          endDate,
          filter: apiFilter
        });
        setActivities(activities);
      } catch (err) {
        setError("Failed to fetch activity log");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [selectedFilterId, dateRangePreset, customRange.startDate, customRange.endDate]);

  // Handler for filter change
  const handleFilterChange = (id) => {
    setSelectedFilterId(id);
  };

  // Handler for date range preset change
  const handleDateRangePresetChange = (preset) => {
    setDateRangePreset(preset);
  };

  // Handler for custom date range change
  const handleCustomRangeChange = (start, end) => {
    setCustomRange({ startDate: start, endDate: end });
    setDateRangePreset("custom");
  };

  // Handler for reset filter
  const handleResetFilter = () => {
    setSelectedFilterId("");
  };

  const filterOptions = [
    // Add this at the top
    { id: "account", name: "Account activity", icon: MdOutlineAccountCircle },
    { id: "listings", name: "Listings", icon: MdOutlineHouse },
    { id: "channel", name: "Channel", icon: MdOutlineHouse },
    { id: "reservation", name: "Reservation", icon: MdOutlineCalendarToday },
    {
      id: "subscriptions",
      name: "Subscriptions and Billing",
      icon: MdOutlineReceipt,
    },
    { id: "smartlock", name: "Smart Lock", icon: MdOutlineLock },
    { id: "rateplan", name: "RatePlan", icon: MdOutlineLocalOffer },
    {
      id: "payout",
      name: "Payout(Withdraw earnings)",
      icon: MdOutlineLocalOffer,
    },
  ];

  const handleFilterToggle = (filterId) => {
    setSelectedFilters((prev) =>
      prev.includes(filterId)
        ? prev.filter((id) => id !== filterId)
        : [...prev, filterId]
    );
  };

  const handleReset = () => {
    setSelectedFilters([]);
  };

  const handleSubmit = () => {
    // Apply filters here
    console.log("Applied filters:", selectedFilters);
    setIsFilterModalOpen(false);
  };

  // ...existing render code, update filter and date range UI to use these handlers...

  return (
    <div className="bg-[#F4F3EF] min-h-screen p-4">
      {/* Activity Log Card */}
      <div className="bg-white rounded-xl shadow-lg p-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div>
            <div className="text-lg font-bold text-[#654EE4]">Activity Log</div>
            <div className="text-sm text-gray-700">Recent Actions</div>
          </div>
          <button
            onClick={() => setIsFilterModalOpen(true)}
            className="flex items-center gap-2 px-3 py-2 bg-gray-100 rounded-lg text-sm font-medium text-gray-700"
          >
            <span>Filters</span>
            <IoMdArrowDropdown className="w-4 h-4 text-gray-600 cursor-pointer" />
          </button>
        </div>

        {/* Activity Content */}
        {loading ? (
          <div className="text-center text-gray-400 py-8">Loading...</div>
        ) : error ? (
          <div className="text-center text-red-500 py-8">{error}</div>
        ) : activities.length === 0 ? (
          <div className="text-center text-gray-400 py-8">
            No activity found.
          </div>
        ) : (
          <div className="space-y-3">
            {activities.map((item, idx) => {
              console.log("item.activityBy:", item.activityBy);
              return (
                <div
                  key={idx}
                  className="flex justify-between p-2 rounded-lg border border-gray-100"
                >
                  {/* Left side: Icon and content - more space */}
                  <div className="flex items-start gap-3 flex-1 mr-4">
                    {/* Icon in circle */}
                    <div className="w-8 h-8 flex items-center justify-center rounded-full border-2 border-purple-200 bg-white">
                      {item.image ? (
                        <img
                          src={item.image}
                          alt=""
                          className="w-5 h-5 object-contain"
                        />
                      ) : (
                        <MdOutlineSync className="w-5 h-5 text-purple-600" />
                      )}
                    </div>

                    {/* Content */}
                    <div className="flex-1 items-start">
                      <div className="font-medium text-xs whitespace-no-wrap text-gray-600 mb-2">
                        {item.activity}
                      </div>
                      {item.subtitle && (
                        <div className="text-xs text-gray-400">
                          {item.subtitle}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Right side: Time and By - less space */}
                  <div className="flex flex-col items-end text-xs text-gray-600">
                    <div className="mb-1">
                      {item.createdAt
                        ? new Date(item.createdAt).toLocaleString("en-US", {
                            month: "short",
                            day: "2-digit",
                            hour: "2-digit",
                            minute: "2-digit",
                            hour12: true,
                          })
                        : ""}
                    </div>
                    {item.activityBy && (
                      <div>By {item.activityBy?.fname || "Stayhub"}</div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Filter By Modal */}
      {isFilterModalOpen && (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl w-full max-w-md mx-4 max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <div className="text-lg font-bold text-gray-800">Filter By</div>
              <div className="flex items-center gap-4">
                <button
                  onClick={handleReset}
                  className="text-orange-500 font-medium"
                >
                  RESET
                </button>
              
              </div>
            </div>

            {/* Filter Options */}
            <div className="p-6">
              <div className="space-y-4">
                {filterOptions.map((option) => {
                  const IconComponent = option.icon;
                  const isSelected = selectedFilters.includes(option.id);

                  return (
                    <div
                      key={option.id}
                      onClick={() => handleFilterToggle(option.id)}
                      className="flex items-center gap-4 p-3 rounded-lg border border-gray-200 cursor-pointer hover:bg-gray-50"
                    >
                      <div
                        className={`w-10 h-10 flex items-center justify-center rounded-full border-2 ${
                          isSelected
                            ? "border-purple-600 bg-purple-50"
                            : "border-purple-200 bg-white"
                        }`}
                      >
                        {IconComponent && (
                          <IconComponent
                            className={`w-5 h-5 ${isSelected ? "text-purple-600" : "text-purple-500"}`}
                          />
                        )}
                      </div>
                      <div className="flex-1">
                        <div className="text-sm font-medium text-gray-800">
                          {option.name}
                        </div>
                      </div>
                      {isSelected && (
                        <div className="w-5 h-5 bg-purple-600 rounded-full flex items-center justify-center">
                          <div className="w-2 h-2 bg-white rounded-full"></div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Submit Button */}
            <div className="p-2 border-t border-gray-200">
              <button
                onClick={handleSubmit}
                className="w-full  bg-[#25A4E8] text-white py-3 rounded-lg font-medium disabled:opacity-50"
              >
                Submit
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ActivityLog;