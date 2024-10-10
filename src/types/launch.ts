export interface AppLaunchRequestBody {
  owned_app_id: string;
  bypass_app_update?: boolean;
  app_arguments?: string[];
  reset_wine_prefix?: boolean;
  launch_config_id?: string;
  input_config_id?: string;
}

interface RegistryEntry {
  [path: string]: [string, string][];
}

interface Symlink {
  source: string;
  target: string;
}

interface OverrideAction {
  op: string;
  path: string;
  value: string;
}

export interface Override {
  conditions: {
    providers?: string[];
    architectures?: string[];
  };
  name: string;
  actions: OverrideAction[];
}

export interface AppLaunchConfig {
  app_arguments?: string[];
  app_executable?: string;
  wine_id?: string;
  extra_registry?: RegistryEntry;
  tricks_config?: { winetricks: string[] };
  env?: { [key: string]: string };
  symlinks?: Symlink[];
  overrides?: Override[];
}

export interface LaunchParams {
  resetWinePrefix: boolean;
  bypassAppUpdate: boolean;
  launchConfigId?: string;
  inputConfigId?: string;
  enhancedDebugging: boolean;
}
