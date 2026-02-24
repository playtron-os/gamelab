import { t } from "@lingui/macro";

export enum PlaytronCompatibilityLevel {
  Verified = "Verified",
  Compatible = "Compatible",
  NotWorking = "NotWorking",
  Unsupported = "Unsupported",
  Unknown = "Unknown"
}

export interface PlaytronCompatibility {
  provider: string;
  value: string;
  percent: number;
}

const orderedLevels = [
  PlaytronCompatibilityLevel.Verified,
  PlaytronCompatibilityLevel.Compatible,
  PlaytronCompatibilityLevel.NotWorking,
  PlaytronCompatibilityLevel.Unsupported,
  PlaytronCompatibilityLevel.Unknown
];

export function getHighestCompatibility(
  compatibility: PlaytronCompatibility[]
): PlaytronCompatibilityLevel {
  for (const level of orderedLevels) {
    if (compatibility.some((c) => c.value === level)) {
      return level;
    }
  }
  return PlaytronCompatibilityLevel.Unknown;
}

export function getCompatibilityLabel(
  level: PlaytronCompatibilityLevel
): string {
  switch (level) {
    case PlaytronCompatibilityLevel.Verified:
      return t`Verified`;
    case PlaytronCompatibilityLevel.Compatible:
      return t`Compatible`;
    case PlaytronCompatibilityLevel.NotWorking:
      return t`Not Working`;
    case PlaytronCompatibilityLevel.Unsupported:
      return t`Unsupported`;
    case PlaytronCompatibilityLevel.Unknown:
      return t`Unknown`;
  }
}
