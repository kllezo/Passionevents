import { z } from "zod";
import { BUDGET_RANGES, ENQUIRY_CATEGORIES, ENQUIRY_SERVICES } from "@/lib/constants";

const phoneRe = /^[+()\-\s\d]{7,20}$/;

export const enquirySchema = z.object({
  fullName: z.string().trim().min(2, "Please tell us your name.").max(120),
  phone: z
    .string()
    .trim()
    .regex(phoneRe, "Please enter a valid phone number.")
    .refine((v) => v.replace(/\D/g, "").length >= 7, "Please enter a valid phone number."),
  email: z.string().trim().toLowerCase().email("Please enter a valid email address.").max(200),
  category: z.enum(ENQUIRY_CATEGORIES, { message: "Please choose an event category." }),
  eventDate: z
    .string()
    .trim()
    .optional()
    .transform((v) => (v ? v : undefined))
    .refine((v) => !v || !Number.isNaN(Date.parse(v)), "Please choose a valid date."),
  location: z.string().trim().max(160).optional().default(""),
  guestCount: z
    .union([z.string(), z.number()])
    .optional()
    .transform((v) => (v === undefined || v === "" ? undefined : Number(v)))
    .refine((v) => v === undefined || (Number.isInteger(v) && v > 0 && v < 1_000_000), "Guest count should be a whole number."),
  budget: z.union([z.enum(BUDGET_RANGES), z.literal("")]).optional().default(""),
  services: z.array(z.enum(ENQUIRY_SERVICES)).max(ENQUIRY_SERVICES.length).default([]),
  details: z.string().trim().max(4000).optional().default(""),
  source: z.enum(["events", "live", "partners"]).optional().default("events"),
  // Honeypot – real visitors never fill this in.
  website: z.string().max(0).optional(),
});

export type EnquiryInput = z.input<typeof enquirySchema>;
export type EnquiryData = z.output<typeof enquirySchema>;
