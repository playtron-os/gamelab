export interface InstallConfig {
  version: string;
  install_disk: string;
  install_root: string;
  install_folder: string;
  symlink_path?: string;
  disk_size: number;
  download_size: number;
  executable: string;
}
