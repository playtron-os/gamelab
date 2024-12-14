import { JSONSchemaType } from "ajv";
import { AppLaunchConfig, Override } from "@/types";

export const launchConfigSchema: JSONSchemaType<AppLaunchConfig> = {
  type: "object",
  additionalProperties: false,
  properties: {
    app_arguments: { type: "array", items: { type: "string" }, nullable: true },
    app_executable: { type: "string", nullable: true },
    wine_id: { type: "string", nullable: true },
    extra_registry: {
      type: "object",
      additionalProperties: true,
      required: [],
      nullable: true
    },
    tricks_config: {
      type: "object",
      properties: { winetricks: { type: "array", items: { type: "string" } } },
      required: ["winetricks"],
      nullable: true
    },
    env: {
      type: "object",
      additionalProperties: true,
      required: [],
      nullable: true
    },
    symlinks: {
      type: "array",
      items: { type: "object", required: [] },
      nullable: true
    },
    overrides: {
      type: "array",
      items: { type: "object", required: [] },
      nullable: true
    }
  }
};

export const overrideSchema: JSONSchemaType<Override> = {
  type: "object",
  additionalProperties: false,
  properties: {
    name: { type: "string" },
    conditions: {
      type: "object",
      properties: {
        architectures: {
          type: "array",
          items: { type: "string" },
          nullable: true
        },
        providers: { type: "array", items: { type: "string" }, nullable: true }
      },
      required: [],
      nullable: false
    },
    actions: {
      type: "array",
      items: {
        type: "object",
        properties: {
          op: { type: "string" },
          path: { type: "string" },
          value: { type: "string" }
        },
        required: ["op", "path", "value"]
      }
    }
  },
  required: ["name", "conditions", "actions"]
};
