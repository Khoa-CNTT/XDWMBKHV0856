import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
} from "react";
import { getOrders } from "../services/order.services";

const MyOrderContext = createContext();

export const MyOrderProvider = ({ children }) => {
  const [myOrders, setMyOrders] = useState([]);
  const [isLoadingMyOrder, setIsLoadingMyOrder] = useState(false);

  const fetchMyOrders = useCallback(async (params) => {
    setIsLoadingMyOrder(true);
    try {
      const response = await getOrders(params);
      setMyOrders(response.result);
    } catch (error) {
      console.error("Error fetching my orders:", error);
    } finally {
      setIsLoadingMyOrder(false);
    }
  }, []);

  useEffect(() => {
    fetchMyOrders(); // Gọi lần đầu
  }, [fetchMyOrders]);

  return (
    <MyOrderContext.Provider
      value={{
        myOrders,
        isLoadingMyOrder,
        refetchMyOrders: fetchMyOrders,
      }}
    >
      {children}
    </MyOrderContext.Provider>
  );
};

export const useMyOrder = () => useContext(MyOrderContext);
