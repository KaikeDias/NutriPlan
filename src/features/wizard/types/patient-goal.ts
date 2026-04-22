export const PATIENT_GOAL_VALUES = [
  "HYPERTROPHY",
  "WEIGHT_LOSS",
  "WEIGHT_MAINTENANCE",
  "LEAN_MASS_GAIN",
  "SPORTS_PERFORMANCE",
  "GENERAL_HEALTH",
  "DIABETES_CONTROL",
  "HYPERTENSION_CONTROL",
  "OTHER",
] as const;

export type PatientGoal = typeof PATIENT_GOAL_VALUES[number];

export const PATIENT_GOAL_LABELS: Record<PatientGoal, string> = {
  HYPERTROPHY: "Hipertrofia",
  WEIGHT_LOSS: "Emagrecimento",
  WEIGHT_MAINTENANCE: "Manutenção de Peso",
  LEAN_MASS_GAIN: "Ganho de Massa Magra",
  SPORTS_PERFORMANCE: "Performance Esportiva",
  GENERAL_HEALTH: "Melhora da Saúde Geral",
  DIABETES_CONTROL: "Controle de Diabetes",
  HYPERTENSION_CONTROL: "Controle de Hipertensão",
  OTHER: "Outro",
};

export function getPatientGoalLabel(goal: PatientGoal): string {
  return PATIENT_GOAL_LABELS[goal];
}
