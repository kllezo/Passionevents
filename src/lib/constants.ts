export const EXPERIENCES = ["EVENTS", "LIVE"] as const;
export type Experience = (typeof EXPERIENCES)[number];

export const PUBLISH_STATES = ["DRAFT", "PUBLISHED"] as const;
export type PublishState = (typeof PUBLISH_STATES)[number];

export const EVENT_STATUSES = ["ANNOUNCED", "ON_SALE", "SOLD_OUT", "POSTPONED", "CANCELLED", "COMPLETED"] as const;
export type EventStatus = (typeof EVENT_STATUSES)[number];
export const EVENT_STATUS_LABEL: Record<EventStatus, string> = {
  ANNOUNCED: "Announced",
  ON_SALE: "Tickets on sale",
  SOLD_OUT: "Sold out",
  POSTPONED: "Postponed",
  CANCELLED: "Cancelled",
  COMPLETED: "Completed",
};

export const EVENT_CATEGORIES = ["WEDDING", "CORPORATE", "PRIVATE", "DESTINATION", "CONCERT", "PRODUCTION", "OTHER"] as const;
export type EventCategory = (typeof EVENT_CATEGORIES)[number];
export const EVENT_CATEGORY_LABEL: Record<EventCategory, string> = {
  WEDDING: "Wedding",
  CORPORATE: "Corporate Event",
  PRIVATE: "Private Celebration",
  DESTINATION: "Destination Event",
  CONCERT: "Concert & Live",
  PRODUCTION: "Event Production",
  OTHER: "Other",
};

/** Enquiry form options (Part 9 of the brief). */
export const ENQUIRY_CATEGORIES = [
  "Wedding",
  "Concert",
  "Corporate Event",
  "Private Celebration",
  "Destination Event",
  "Other",
] as const;

export const ENQUIRY_SERVICES = [
  "Venue",
  "Catering",
  "Decor",
  "Photography",
  "Videography",
  "Stage",
  "Sound and Lighting",
  "Artist Booking",
  "Accommodation",
  "Transport",
  "Complete Event Management",
  "Other",
] as const;

export const BUDGET_RANGES = [
  "Under ₹5 lakh",
  "₹5 – 15 lakh",
  "₹15 – 30 lakh",
  "₹30 – 60 lakh",
  "₹60 lakh – 1 crore",
  "Above ₹1 crore",
  "Not sure yet",
] as const;

export const ENQUIRY_STATUSES = ["NEW", "CONTACTED", "CLOSED"] as const;
