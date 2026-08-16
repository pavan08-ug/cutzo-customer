import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { Browser } from "@capacitor/browser";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export async function openExternalUrl(url: string) {
  try {
    await Browser.open({ url });
  } catch (error) {
    window.open(url, "_blank");
  }
}
