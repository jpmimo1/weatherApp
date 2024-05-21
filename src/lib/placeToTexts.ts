import { Result } from "@/types";

interface ArgPlaceToTexts { state?: string, country: string, city?: string, region?: string };

export const placeToTexts = (place: ArgPlaceToTexts): { line1: string, line2: string } => {
  const { state, country, city, region } = place;

  const line1 = city || region || state || "";

  const line2 = ((city || region) && state) ? `${state}, ${country}` : country;

  return { line1, line2 };
};
