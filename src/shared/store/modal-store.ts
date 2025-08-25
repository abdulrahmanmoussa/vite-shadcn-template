import { create } from "zustand";

export type ModalType = "submit";

export interface ModalData {
  id?: string;
  name?: string;
  description?: string;
  image?: string;
  date?: string;
  type?: string;
  private?: number;
}

interface ModalStore {
  type: ModalType | null;
  data: ModalData | any;
  refetch?: () => void;
  isOpen: boolean;
  onOpen: (type: ModalType, data?: any, refetch?: () => void) => void;
  onClose: () => void;
  setData: (data?: any) => void;
}

export const useModal = create<ModalStore>((set) => ({
  type: null,
  data: {},
  setData: (data?: any) => set({ data }),
  isOpen: false,
  onOpen: (type, data = {}, refetch) =>
    set({ type, isOpen: true, data, refetch }),
  onClose: () => set({ type: null, isOpen: false }),
}));
