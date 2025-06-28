// types/formsOng.ts
export interface FormInputs {
  title: string;
  description: string;
  type: "ADOPCION" | "DONACION" | "";
  donationGoal?: number;
  petId?: string;
}

