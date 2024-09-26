import { AppProvider } from "../../platform-auth";

export interface PlaytronProvider {
  provider: AppProvider;
  providerAppId: string;
  lastImportedTimestamp?: Date;
  relatedAppIds: string[];
}
