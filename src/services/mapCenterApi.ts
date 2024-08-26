import axiosClient from "@/config/client";
import { handleAxiosError } from "@/util/error";
import logger from '../../logger.config.mjs';

// Function to Save Map Center
export const saveMapCenter = async (latitude: number, longitude: number) => {
  try {
    logger.info(`Saving map center with coordinates: latitude ${latitude}, longitude ${longitude}`);
    const response = await axiosClient.put('/api/v1/map-center/save', {
      latitude,
      longitude
    });
    
    if (response.status === 200) {
      logger.info(`Save map center successful with Status ${response.status}`, {
        data: response.data
      });
      return response.data;
    } else {
      logger.error(`Save map center failed with Status ${response.status}`);
      return null;
    }
  } catch (error: any) {
    logger.error(`Save map center encountered an error: ${error.message}`, {
      error: error.toString()
    });
    handleAxiosError(error);
    throw error;
  }
};

export const fetchMapCenter = async () => {
  try {
    logger.info('Fetching map center..');
    const response = await axiosClient.get('/api/v1/map-center');
    
    if (response.status === 200) {
      logger.info(`Fetch map center successful with Status ${response.status}`, {
        data: response.data
      });
      return response.data;
    } else {
      logger.error(`Fetch map center failed with Status ${response.status}`);
      return null;
    }
  } catch (error: any) {
    logger.error(`Fetch map center encountered an error: ${error.message}`, {
      error: error.toString()
    });
    handleAxiosError(error);
    throw error;
  }
};