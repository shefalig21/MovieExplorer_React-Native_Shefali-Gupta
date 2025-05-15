import axios from "axios";

const movieURL = "https://movie-explorer-ror-varun.onrender.com";

export const getMovieDetails = async (page = 1) => {
  try {
    const response = await axios.get(`${movieURL}/api/v1/movies?page=${page}`);
    return response.data;
  } catch (error) {
    console.error("Error in getting movie details:", error.response?.data || error.message);
    throw error;
  }
};

export const fetchMoviesBySearch = async (searchText, page = 1) => {
  try {
    const response = await axios.get(`${movieURL}/api/v1/movies/search?search=${searchText}&page=${page}`);
    return response.data;
  } catch (error) {
    console.error("Error in fetching movies by search:", error.response?.data || error.message);
    throw error;
  }
};


export const fetchMoviesByGenre = async (genre, page = 1) => {
  try {
    const response = await axios.get(`${movieURL}/api/v1/movies/search?genre=${genre}&page=${page}`);
    return response.data;
  } catch (error) {
    console.error("Error in fetching movies by genre:", error.response?.data || error.message);
    throw error;
  }
};


export const fetchMoviesByReleaseYear = async (releaseYear, page = 1) => {
  try {
    const response = await axios.get(`${movieURL}/api/v1/movies/search?release_year=${releaseYear}&page=${page}`);
    return response.data;
  } catch (error) {
    console.error("Error in fetching movies by release year:", error.response?.data || error.message);
    throw error;
  }
};


export const fetchMoviesByRating = async (rating, page = 1) => {
  try {
    const response = await axios.get(`${movieURL}/api/v1/movies/search?rating=${rating}&page=${page}`);
    return response.data;
  } catch (error) {
    console.error("Error in fetching movies by rating:", error.response?.data || error.message);
    throw error;
  }
};