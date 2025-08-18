import axiosInstance from './axiosInstance';

export const addToWatchlist = (stockId) =>
  axiosInstance.post(`/api/watchlist/add`, { stockId });

export const removeFromWatchlist = (stockId) =>
  axiosInstance.delete(`/api/watchlist/remove/${stockId}`);

export const getUserWatchlist = () =>
  axiosInstance.get(`/api/watchlist`);
