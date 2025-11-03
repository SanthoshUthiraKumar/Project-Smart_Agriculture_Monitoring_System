import axios from 'axios';

// The URL of your Java Spring Boot backend
const API_URL = 'http://localhost:8080/api/data';

/**
 * Fetches all sensor readings from the database.
 */
export const getAllReadings = () => {
    return axios.get(`${API_URL}/all`);
};