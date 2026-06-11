import { create } from "zustand";

interface Employee {
  name: string;
  phone: string;
  department: string;
  role: string;
}

interface OnboardingStore {
  ownerName: string;
  email: string;
  phone: string;

  organizationName: string;
  organizationType: string;
  companySize: string;
  industry: string;

  employees: Employee[];

  reminderTime: string;
  reminderFrequency: string;

  setField: (field: string, value: any) => void;

  addEmployee: (employee: Employee) => void;
}

export const useOnboardingStore = create<OnboardingStore>((set) => ({
  ownerName: "",
  email: "",
  phone: "",

  organizationName: "",
  organizationType: "",
  companySize: "",
  industry: "",

  employees: [],

  reminderTime: "09:00",
  reminderFrequency: "Daily",

  setField: (field, value) =>
    set((state: any) => ({
      ...state,
      [field]: value,
    })),

  addEmployee: (employee) =>
    set((state) => ({
      employees: [...state.employees, employee],
    })),
}));
