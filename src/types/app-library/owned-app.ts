import { AppType } from "../app";
import { AppProvider } from "../platform-auth";

export interface OwnedApp {
  id: string;
  name: string;
  provider: AppProvider;
  provider_id: string;
  app_type?: AppType;
}
