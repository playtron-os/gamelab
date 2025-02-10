import configTemplate from "./launch-config-template.json";

export const DEFAULT_LAUNCH_CONFIG = {
  name: "New Launch Config",
  description: "",
  data: JSON.stringify(configTemplate, undefined, 0)
};
