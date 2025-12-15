const API_KEY = '848d4c9db9d3f19d0229dc95735190d3'; // Apki Key
const BASE_URL = 'https://api.themoviedb.org/3';

export const fetchTMDB = async (endpoint) => {
  const res = await fetch(`${BASE_URL}${endpoint}&api_key=${API_KEY}`);
  const data = await res.json();
  return data.results;
};

export const getTrending = () => fetchTMDB('/trending/movie/day?language=en-US');
export const getUpcoming = () => fetchTMDB('/movie/upcoming?language=en-US&page=1');
export const getTopRated = () => fetchTMDB('/movie/top_rated?language=en-US&page=1');

// Bollywood (Hindi) Movies
export const getBollywood = () => fetchTMDB('/discover/movie?language=hi-IN&with_original_language=hi&sort_by=popularity.desc');

// South Indian Movies (Tamil/Telugu mixed logic)
export const getSouth = () => fetchTMDB('/discover/movie?language=en-US&with_original_language=te|ta&sort_by=popularity.desc');
