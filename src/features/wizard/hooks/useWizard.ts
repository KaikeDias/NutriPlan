import { useEffect, useState } from "react";
import { defaultWizardStore, type WizardStore } from "../types/wizard-store";

const STORAGE_KEY = "diet_wizard";

function loadFromStorage(): WizardStore {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) return { ...defaultWizardStore, ...JSON.parse(stored) };
  } catch {
    // ignore corrupt data
  }
  return defaultWizardStore;
}

export function useWizard() {
  const [step, setStep] = useState(1);
  const [data, setData] = useState<WizardStore>(loadFromStorage);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  }, [data]);

  function next() {
    setStep((prev) => Math.min(prev + 1, 4));
  }

  function prev() {
    setStep((prev) => Math.max(prev - 1, 1));
  }

  function updateSection<K extends keyof WizardStore>(key: K, value: WizardStore[K]) {
    setData((prev) => ({ ...prev, [key]: value }));
  }

  return { step, data, next, prev, updateSection };
}