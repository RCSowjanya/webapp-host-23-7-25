"use server";

import api from "@/utils/apiService";
import { auth } from "@/app/(dashboard-screens)/auth";

/**
 * Fetch rate plan data for a property
 * @param {Object} params - Rate plan parameters
 * @param {string} params.startDate - Check-in date (ISO string)
 * @param {string} params.endDate - Check-out date (ISO string)
 * @param {string} params.propertyId - Property ID
 * @returns {Promise<Object>} Rate plan data
 */
export const getRatePlan = async (params) => {
  const session = await auth();
  const token = session?.token;

  console.log("Session object:", session);
  console.log("Token from session:", token);

  if (!token) {
    console.log("No token found for rate plan request");
    return {
      success: false,
      message: "No token. Please log in again.",
      data: null,
    };
  }

  // Validate required parameters
  console.log("Rate Plan Parameters received:", params);
  console.log("Parameter validation:", {
    startDate: params.startDate,
    endDate: params.endDate,
    propertyId: params.propertyId,
    hasStartDate: !!params.startDate,
    hasEndDate: !!params.endDate,
    hasPropertyId: !!params.propertyId,
  });

  if (!params.startDate || !params.endDate || !params.propertyId) {
    console.error("Missing required parameters:", {
      startDate: params.startDate,
      endDate: params.endDate,
      propertyId: params.propertyId,
    });
    return {
      success: false,
      message:
        "Missing required parameters: startDate, endDate, and propertyId are required.",
      data: null,
    };
  }

  try {
    console.log("Fetching rate plan with params:", params);
    console.log("Date format check:", {
      startDate: params.startDate,
      endDate: params.endDate,
      startDateParsed: new Date(params.startDate),
      endDateParsed: new Date(params.endDate),
    });

    const requestBody = {
      startDate: params.startDate,
      endDate: params.endDate,
      propertyId: params.propertyId,
      isPmBooking: true,
    };

    const response = await api.post("/property/rate", requestBody, {
      authorizationHeader: `Bearer ${token}`,
      showErrorToast: false, // Handle toast in the component
      errorMessage: "Failed to fetch rate plan.",
    });

    console.log("Rate Plan API Response:", response);

    // Check for successful response
    console.log("Full API response structure:", {
      responseSuccess: response?.success,
      responseDataSuccess: response?.data?.success,
      responseData: response?.data,
      responseMessage: response?.message,
    });

    if (response?.success && response?.data?.success) {
      const rateData = response.data.data;
      console.log("Rate Plan Data:", rateData);
      console.log("Is Blocked Check:", rateData?.isBlocked);
      console.log("Full rateData object:", JSON.stringify(rateData, null, 2));

      // Check if the unit is blocked
      console.log("Checking for blocked dates...");
      console.log("rateData.isBlocked:", rateData?.isBlocked);
      console.log("All rateData properties:", Object.keys(rateData || {}));

      if (rateData?.isBlocked) {
        console.log("Unit is blocked - preventing booking");
        return {
          success: false,
          data: null,
          message:
            "Those dates are blocked due to some reason, please select another date.",
          isBlocked: true,
        };
      }

      // Check if there's any other indication of blocked dates in the response
      if (
        rateData?.blocked ||
        rateData?.unavailable ||
        rateData?.notAvailable
      ) {
        console.log(
          "Unit is blocked (alternative property) - preventing booking"
        );
        return {
          success: false,
          data: null,
          message:
            "Those dates are blocked due to some reason, please select another date.",
          isBlocked: true,
        };
      }

      return {
        success: true,
        data: rateData,
        message: "Rate plan fetched successfully",
        isBlocked: false,
      };
    } else {
      console.error(
        "Rate Plan API Failed:",
        response?.data?.message || response?.message
      );
      console.log("Failed response details:", response);

      // Check if the failure is due to blocked dates
      const errorMessage = response?.data?.message || response?.message || "";
      if (
        errorMessage.toLowerCase().includes("blocked") ||
        errorMessage.toLowerCase().includes("unavailable") ||
        errorMessage.toLowerCase().includes("not available")
      ) {
        return {
          success: false,
          message:
            "Those dates are blocked due to some reason, please select another date.",
          data: null,
          isBlocked: true,
        };
      }

      return {
        success: false,
        message:
          response?.data?.message ||
          response?.message ||
          "Failed to fetch rate plan. Please try again.",
        data: null,
      };
    }
  } catch (error) {
    console.error("Rate Plan Error:", error);

    // Handle specific error cases
    let errorMessage = "An error occurred while fetching rate plan.";

    if (error.message) {
      const match = error.message.match(/(\d+):\s*(.*)/);
      if (match) {
        const [, statusCode, message] = match;
        switch (statusCode) {
          case "400":
            errorMessage =
              "Invalid date selection. Please choose different dates.";
            break;
          case "401":
            errorMessage = "Please login to check room availability.";
            break;
          case "404":
            errorMessage = "Property not found.";
            break;
          case "409":
            errorMessage =
              "Selected dates are already booked. Please choose different dates.";
            break;
          case "500":
            errorMessage = "Unable to fetch rates. Please try again.";
            break;
          default:
            try {
              const errorData = JSON.parse(message);
              errorMessage =
                errorData.message ||
                "Unable to fetch rates for selected dates.";
            } catch (e) {
              errorMessage =
                message || "Unable to fetch rates for selected dates.";
            }
        }
      } else if (error.message.includes("Failed to fetch")) {
        errorMessage =
          "Network error. Please check your connection and try again.";
      } else {
        errorMessage = error.message;
      }
    }

    return {
      success: false,
      message: errorMessage,
      data: null,
    };
  }
};

export default getRatePlan;
