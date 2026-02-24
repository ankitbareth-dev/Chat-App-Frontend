import { useEffect, useRef } from "react";

export const useHistoryStack = (
  isOpen: boolean,
  onClose: () => void,
  id: string = "default",
) => {
  const onCloseRef = useRef(onClose);

  useEffect(() => {
    onCloseRef.current = onClose;
  }, [onClose]);

  useEffect(() => {
    if (isOpen) {
      if (window.history.state?.id !== id) {
        window.history.pushState({ open: true, id }, "");
      }
    }
  }, [isOpen, id]);

  useEffect(() => {
    const handlePopState = () => {
      if (isOpen) {
        onCloseRef.current();
      }
    };

    window.addEventListener("popstate", handlePopState);

    return () => {
      window.removeEventListener("popstate", handlePopState);
    };
  }, [isOpen]);
};
