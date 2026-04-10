import { clsx, type ClassValue } from "clsx";
import slugify from "slugify";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function buildSlug(text: string) {
  const normalized = text.replace(/_/g, "-");

  const base = slugify(normalized, {
    lower: true,
    strict: true,
    trim: true,
  });

  return base;
}

export function unslugify(slug: string) {
  return slug.replace(/-/g, "_").toUpperCase();
}

export const formatDate = (date: string) =>
  new Date(date).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
