import { PlaytronAgeRating } from "./playtron-age-rating";
import { PlaytronAppType } from "./playtron-app-type";
import { PlaytronCompatibility } from "./playtron-compatibility";
import { PlaytronCredit } from "./playtron-credit";
import { PlaytronGameSeries } from "./playtron-game-series";
import { PlaytronImage } from "./playtron-image";
import { PlaytronPopularity } from "./playtron-popularity";
import { PlaytronProvider } from "./playtron-provider";
import { PlaytronRating } from "./playtron-rating";
import { PlaytronSale } from "./playtron-sale";
import { PlaytronTag } from "./playtron-tag";

export interface PlaytronApp {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  name: string;
  cmsId: number;
  providers: PlaytronProvider[];
  slug: string;
  summary: string;
  description: string;
  tags: PlaytronTag[];
  images: PlaytronImage[];
  publishers: string[];
  developers: string[];
  gameSeries?: PlaytronGameSeries;
  appType: PlaytronAppType;
  releaseDate?: Date;
  release_date?: Date; // FIXME: make camelCase usage cohesive with AppInformation
  comingSoon: boolean;
  ageRating?: PlaytronAgeRating;
  credits?: PlaytronCredit;
  onlyPlaytron: boolean;
  popularity: PlaytronPopularity[];
  ratings: PlaytronRating[];
  sales: PlaytronSale[];
  compatibility?: PlaytronCompatibility[];
}
