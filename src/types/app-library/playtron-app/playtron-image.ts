import { AppProvider } from "../../platform-auth";

export interface PlaytronImage {
  image_type: string;
  url: string;
  alt: string;
  source: AppProvider;
}
