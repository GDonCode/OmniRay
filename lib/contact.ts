/** Shared by the contact form (client) and its server action. */
export const PROJECT_TYPES = [
  "Website",
  "E-commerce or booking platform",
  "Web app or internal tool",
  "Mobile app",
  "Something else",
] as const;

export type ContactValues = {
  name: string;
  email: string;
  type: string;
  message: string;
};
export type ContactState = {
  status: "idle" | "success" | "error";
  message?: string;
  errors?: Partial<Record<keyof ContactValues, string>>;
  values?: ContactValues;
};
