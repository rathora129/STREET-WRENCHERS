import { create } from 'zustand';

const initialValues = {
  brandId: '',
  brandName: '',
  modelName: '',
  year: '',
  fuelType: '',
  serviceId: '',
  serviceName: '',
  packageId: '',
  packageName: '',
  date: '',
  time: '',
  pickupRequired: false,
  pickupAddress: '',
  customerName: '',
  phone: '',
  email: '',
  notes: '',
};

export const useBookingStore = create((set) => ({
  ...initialValues,
  step: 0,
  setField: (key, value) => set({ [key]: value }),
  setFields: (values) => set(values),
  setStep: (step) => set({ step }),
  reset: () => set({ ...initialValues, step: 0 }),
}));
