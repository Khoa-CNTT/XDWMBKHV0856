import { useState, createContext, useContext } from "react";
import PropTypes from "prop-types";
import { FiShoppingCart, FiMinus, FiPlus, FiTrash2 } from "react-icons/fi";
import { AiOutlineLoading3Quarters } from "react-icons/ai";

const CartContext = createContext();

const cartItems = [
  {
    id: 1,
    name: "Premium Wireless Headphones",
    price: 199.99,
    quantity: 1,
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e",
  },
  {
    id: 2,
    name: "Smart Fitness Watch",
    price: 299.99,
    quantity: 1,
    image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30",
  },
];

const PaymentMethods = {
  COD: "Cash on Delivery",
  BANK: "Bank Transfer",
  MOMO: "MoMo Wallet",
  ZALO: "ZaloPay",
  CARD: "Credit/Debit Card",
};

const CartProvider = ({ children }) => {
  const [cart, setCart] = useState(cartItems);
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("");
  const [shippingInfo, setShippingInfo] = useState({
    fullName: "",
    phone: "",
    address: "",
    email: "",
    saveInfo: false,
  });

  const updateQuantity = (id, change) => {
    setCart(
      cart
        .map((item) =>
          item.id === id
            ? { ...item, quantity: Math.max(0, item.quantity + change) }
            : item
        )
        .filter((item) => item.quantity > 0)
    );
  };

  const removeItem = (id) => {
    setCart(cart.filter((item) => item.id !== id));
  };

  const calculateTotal = () => {
    return cart.reduce((total, item) => total + item.price * item.quantity, 0);
  };

  const validateForm = () => {
    const { fullName, phone, address, email } = shippingInfo;
    return fullName && phone && address && email && paymentMethod;
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        updateQuantity,
        removeItem,
        step,
        setStep,
        loading,
        setLoading,
        paymentMethod,
        setPaymentMethod,
        shippingInfo,
        setShippingInfo,
        calculateTotal,
        validateForm,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
CartProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

const CartItem = ({ item }) => {
  const { updateQuantity, removeItem } = useContext(CartContext);

  return (
    <div className="flex items-center p-4 border-b border-border">
      <img
        src={item.image}
        alt={item.name}
        className="w-20 h-20 object-cover rounded-md"
        onError={(e) =>
        (e.target.src =
          "https://images.unsplash.com/photo-1580870069867-74c57ee1bb07")
        }
      />
      <div className="flex-1 ml-4">
        <h3 className="text-lg font-semibold">{item.name}</h3>
        <p className="text-accent">${item.price.toFixed(2)}</p>
        <div className="flex items-center mt-2">
          <button
            onClick={() => updateQuantity(item.id, -1)}
            className="p-1 text-accent hover:text-primary"
          >
            <FiMinus />
          </button>
          <span className="mx-2">{item.quantity}</span>
          <button
            onClick={() => updateQuantity(item.id, 1)}
            className="p-1 text-accent hover:text-primary"
          >
            <FiPlus />
          </button>
          <button
            onClick={() => removeItem(item.id)}
            className="ml-4 text-destructive"
          >
            <FiTrash2 />
          </button>
        </div>
      </div>
    </div>
  );
};

const CartSummary = () => {
  const { cart, calculateTotal } = useContext(CartContext);
  const subtotal = calculateTotal();
  const shipping = 10;
  const total = subtotal + shipping;

  return (
    <div className="bg-card p-6 rounded-lg shadow-sm">
      <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
      <div className="space-y-2">
        <div className="flex justify-between">
          <span>Subtotal</span>
          <span>${subtotal.toFixed(2)}</span>
        </div>
        <div className="flex justify-between">
          <span>Shipping</span>
          <span>${shipping.toFixed(2)}</span>
        </div>
        <div className="border-t border-border pt-2 mt-2">
          <div className="flex justify-between font-semibold">
            <span>Total</span>
            <span>${total.toFixed(2)}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

const CheckoutForm = () => {
  const { shippingInfo, setShippingInfo, paymentMethod, setPaymentMethod } =
    useContext(CartContext);

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <input
          type="text"
          placeholder="Full Name"
          value={shippingInfo.fullName}
          onChange={(e) =>
            setShippingInfo({ ...shippingInfo, fullName: e.target.value })
          }
          className="w-full p-3 border border-input rounded-md"
        />
        <input
          type="tel"
          placeholder="Phone Number"
          value={shippingInfo.phone}
          onChange={(e) =>
            setShippingInfo({ ...shippingInfo, phone: e.target.value })
          }
          className="w-full p-3 border border-input rounded-md"
        />
        <input
          type="text"
          placeholder="Delivery Address"
          value={shippingInfo.address}
          onChange={(e) =>
            setShippingInfo({ ...shippingInfo, address: e.target.value })
          }
          className="w-full p-3 border border-input rounded-md"
        />
        <input
          type="email"
          placeholder="Email Address"
          value={shippingInfo.email}
          onChange={(e) =>
            setShippingInfo({ ...shippingInfo, email: e.target.value })
          }
          className="w-full p-3 border border-input rounded-md"
        />
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Payment Method</h3>
        {Object.entries(PaymentMethods).map(([key, value]) => (
          <label key={key} className="flex items-center space-x-3">
            <input
              type="radio"
              name="payment"
              value={key}
              checked={paymentMethod === key}
              onChange={(e) => setPaymentMethod(e.target.value)}
              className="text-primary"
            />
            <span>{value}</span>
          </label>
        ))}
      </div>

      <label className="flex items-center space-x-2">
        <input
          type="checkbox"
          checked={shippingInfo.saveInfo}
          onChange={(e) =>
            setShippingInfo({ ...shippingInfo, saveInfo: e.target.checked })
          }
          className="text-primary"
        />
        <span>Save information for future purchases</span>
      </label>
    </div>
  );
};

const Cart = () => {
  const { cart, step, setStep, loading, validateForm } =
    useContext(CartContext);

  const handleContinue = () => {
    if (step === 1 && cart.length === 0) {
      alert("Your cart is empty");
      return;
    }
    if (step === 2 && !validateForm()) {
      alert("Please fill in all required fields");
      return;
    }
    if (step === 2) {
      // Handle payment processing
      alert("Order placed successfully!");
    } else {
      setStep(step + 1);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 pb-32">
      <div className="flex items-center mb-8">
        <FiShoppingCart className="text-2xl text-primary" />
        <h1 className="text-2xl font-bold ml-2">Shopping Cart</h1>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        <div className="flex-1">
          {step === 1 ? (
            <div className="bg-card rounded-lg shadow-sm overflow-hidden">
              {cart.map((item) => (
                <CartItem key={item.id} item={item} />
              ))}
              {cart.length === 0 && (
                <p className="p-4 text-center text-accent">
                  Your cart is empty
                </p>
              )}
            </div>
          ) : (
            <CheckoutForm />
          )}
        </div>

        <div className="lg:w-1/3">
          <CartSummary />
          <button
            onClick={handleContinue}
            disabled={loading}
            className="w-full mt-4 bg-primary text-primary-foreground py-3 rounded-md font-semibold flex items-center justify-center"
          >
            {loading ? (
              <AiOutlineLoading3Quarters className="animate-spin" />
            ) : step === 1 ? (
              "Proceed to Checkout"
            ) : (
              "Place Order"
            )}
          </button>
          {step === 2 && (
            <button
              onClick={() => setStep(1)}
              className="w-full mt-2 bg-secondary text-secondary-foreground py-3 rounded-md font-semibold"
            >
              Back to Cart
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

const CartPage = () => {
  return (
    <CartProvider>
      <Cart />
    </CartProvider>
  );
};

export default CartPage;
