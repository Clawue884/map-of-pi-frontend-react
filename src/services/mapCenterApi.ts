import axiosClient from "@/config/client";
import { handleAxiosError } from "@/util/error";

// Function to Save Map Center
export const saveMapCenter = async (latitude: number, longitude: number) => {
  try {
    const response = await axiosClient.put(`/map-center/save`, {
      latitude,
      longitude
    });
    if (response.status === 200) {
      return response.data;
    } else {
      console.error(`Save map center failed: ${response.status}`);
      return null;
    }
  } catch (error: any) {
    handleAxiosError(error);
    throw error;
  }
};

export const fetchMapCenter = async () => {
  console.log("Fetching map center data...");
  console.log()
  try {
    const response = await axiosClient.get('/map-center');
    if (response.status === 200) {
      return response.data;
    } else {
      console.error(`Fetch map center failed: ${response.status}`);
      return null;
    }
  } catch (error: any) {
    handleAxiosError(error);
    throw error;
  }
};