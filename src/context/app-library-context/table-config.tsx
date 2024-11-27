// import { LibraryCheckbox } from "@/components/library-checkbox/library-checkbox";
import { AppProvider, AppStatus } from "@/types";
import { AppInformation, OwnedApp } from "@/types/app-library";
import { getAppStatus } from "@/utils/app-info";
import { createColumnHelper } from "@tanstack/table-core";
import { AppActionCell } from "./components/table-cells/app-action-cell";
// import { BulkActionButtonCell } from "./components/table-cells/bulk-action-button-cell";
import { StatusCell } from "./components/table-cells/status-cell";
import { ImageCell } from "./components/table-cells/image-cell";
import { NameCell } from "./components/table-cells/name-cell";
import { DriveCell } from "./components/table-cells/drive-cell";
import { ProviderCell } from "./components/table-cells/provider-cell";
import { SizeCell } from "./components/table-cells/size-cell";
import { t } from "@lingui/macro";
const columnHelper = createColumnHelper<AppInformation>();

export const columnConfig = [
  // Checkbox
  // columnHelper.display({
  //   id: "checkbox-selection",
  //   header: LibraryCheckbox,
  //   cell: LibraryCheckbox,
  //   size: 32
  // }),
  columnHelper.accessor("app.images", {
    id: "image",
    enableSorting: false,
    // header: BulkActionButtonCell,
    header: "",
    size: 100,
    cell: ImageCell
  }),

  // Name
  columnHelper.accessor("app.name", {
    id: "name",
    header: () => t`Title`,
    size: 240,
    cell: NameCell
  }),

  // Size
  columnHelper.accessor(
    (row: AppInformation): number => {
      if (!row.installed_app?.install_config) {
        return 0;
      }
      return row.installed_app?.install_config.disk_size;
    },
    {
      id: "size",
      header: () => t`Size`,
      size: 50,
      cell: SizeCell
    }
  ),

  // Provider
  columnHelper.accessor(
    (row: AppInformation): AppProvider[] =>
      row.owned_apps.map((ownedApp: OwnedApp) => ownedApp.provider),
    {
      id: "provider",
      header: () => t`Provider`,
      size: 50,
      cell: ProviderCell,
      filterFn: "arrIncludesSome"
    }
  ),

  // Status
  columnHelper.accessor(
    (row: AppInformation): AppStatus[] => {
      return [getAppStatus(row)];
    },
    {
      id: "status",
      header: () => t`Status`,
      size: 70,
      cell: StatusCell,
      filterFn: "arrIncludesSome"
    }
  ),

  // Drive
  columnHelper.accessor(
    (row: AppInformation): string => {
      if (!row.installed_app?.install_config) {
        return "";
      }
      return row.installed_app?.install_config.install_disk;
    },
    {
      id: "drive",
      header: () => t`Drive`,
      size: 50,
      cell: DriveCell,
      filterFn: "arrIncludesSome"
    }
  ),

  // Actions
  columnHelper.accessor("app", {
    id: "app-actions",
    size: 32,
    header: "",
    cell: AppActionCell
  })
];
