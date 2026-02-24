import React from "react";
import {
  CheckCircleFill,
  CheckboxBlankCircleFill,
  ErrorWarningFill,
  ForbidFill,
  QuestionFill,
  styles
} from "@playtron/styleguide";

import { PlaytronCompatibilityLevel } from "@/types/app-library/playtron-app/playtron-compatibility";

export const compatibilityConfig: Record<
  PlaytronCompatibilityLevel,
  { icon: React.FC<React.SVGProps<SVGSVGElement>>; color: string }
> = {
  [PlaytronCompatibilityLevel.Verified]: {
    icon: CheckCircleFill,
    color: styles.variablesDark.feedback["success-primary"]
  },
  [PlaytronCompatibilityLevel.Compatible]: {
    icon: CheckboxBlankCircleFill,
    color: styles.variablesDark.state["default"]
  },
  [PlaytronCompatibilityLevel.NotWorking]: {
    icon: ErrorWarningFill,
    color: styles.variablesDark.feedback["error-primary"]
  },
  [PlaytronCompatibilityLevel.Unsupported]: {
    icon: ForbidFill,
    color: styles.variablesDark.feedback["error-primary"]
  },
  [PlaytronCompatibilityLevel.Unknown]: {
    icon: QuestionFill,
    color: styles.variablesDark.fill.normal
  }
};

export const getCompatibilityIcon = (
  level: PlaytronCompatibilityLevel,
  size: number = 16
) => {
  const { icon: Icon, color } = compatibilityConfig[level];
  return <Icon fill={color} width={size} height={size} />;
};
