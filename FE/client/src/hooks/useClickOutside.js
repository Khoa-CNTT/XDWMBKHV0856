import { useEffect, useRef } from "react";

function useClickOutside(handler) {
  const ref = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      // nếu click bên ngoài element được ref tới thì gọi handler
      if (ref.current && !ref.current.contains(event.target)) {
        handler();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [handler]);

  return ref;
}

export default useClickOutside;
