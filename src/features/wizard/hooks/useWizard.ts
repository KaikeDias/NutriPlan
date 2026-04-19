import { useEffect, useState } from "react";

export type WizardData = {
  professional : {
    name: string;
    crn: string;
    document: string;
    logo?: string;    
  };
  patient: {
    name: string;
    age: string;
    weight: string;
  };
  diet: {
    meals: {
      name: string;
      foods: {
        name: string;
        quantity: string;
      }[];
    }[];
  };
}

const STORAGE_KEY = "diet_wizard";

export function useWizard() {
  const [step, setStep] = useState(1);

  const [data, setData] = useState<WizardData>(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : {
      professional: {
        name: "",
        crn: "",
        document: "",
        logo: ""
      },
      patient: {
        name: "",
        age: "",
        weight: ""
      },
      diet: {
        meals: []
      }
    };
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  }, [data]);

  function next() {
    setStep((prev) => Math.min(prev + 1, 4));
  }

  function prev() {
    setStep((prev) => Math.max(prev - 1, 1));
  }

  function update<K extends keyof WizardData>(key: K, value: WizardData[K]) {
    setData((prev) => ({
      ...prev,
      [key]: value
    }));
  }

  return {
    step,
    data,
    next,
    prev,
    update
  };
}