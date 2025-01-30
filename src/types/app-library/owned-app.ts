import { AppType } from "../app";

export interface OwnedApp {
  id: string;
  name: string;
  provider: string;
  provider_id: string;
  app_type?: AppType;
}
