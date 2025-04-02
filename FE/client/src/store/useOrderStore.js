import { create } from "zustand";
import { getOrders } from "../services/order.services";

export const useOrderStore = create((set) => ({
  orders: [],
  isLoadingOrders: false,
  fetchOrders: async (params) => {
    set({ isLoadingOrders: true });
    try {
      const response = await getOrders(params);
      set({ orders: response.result, isLoadingOrders: false });
    } catch (error) {
      set({ isLoadingOrders: false });
      throw error;
    }
  },
}));
