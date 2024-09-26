import configTemplate from "./launch-config-template.json";

export const DEFAULT_LAUNCH_CONFIG = {
  name: "New Launch Config",
  desciprion: "",
  data: JSON.stringify(configTemplate, undefined, 0)
};
