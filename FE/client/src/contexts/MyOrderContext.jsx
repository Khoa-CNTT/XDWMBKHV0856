import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
} from "react";
import { getOrders } from "../services/order.services";
import { useAuth } from "./AuthContext";

const MyOrderContext = createContext();

export const MyOrderProvider = ({ children }) => {
  const { user } = useAuth();
  const [myOrders, setMyOrders] = useState([]);
  const [isLoadingMyOrder, setIsLoadingMyOrder] = useState(false);

  const fetchMyOrders = useCallback(
    async (params) => {
      setIsLoadingMyOrder(true);
      try {
        const response = await getOrders(params);
        const filtered = response.result.filter(
          (order) => order.buyer.id === user.id
        );
        setMyOrders(filtered);
      } catch (error) {
        console.error("Error fetching my orders:", error);
      } finally {
        setIsLoadingMyOrder(false);
      }
    },
    [user]
  );

  useEffect(() => {
    if (!user) return;

    fetchMyOrders({
      filter: `buyer.id~'${user?.id}'`,
    }); // Gọi lần đầu
  }, [fetchMyOrders, user]);

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
