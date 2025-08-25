import { useEffect, useState, type JSX } from "react";
import { useModal, type ModalType } from "../store/modal-store";

export const ModalProvider = () => {
  const { type } = useModal();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) return null;

  const modals: Record<ModalType, JSX.Element> = {
    submit: <div>Submit</div>,
  };

  return <>{type && modals[type as ModalType]}</>;
};
