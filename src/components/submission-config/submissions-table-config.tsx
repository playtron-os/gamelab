import { createColumnHelper } from "@tanstack/table-core";
import { Submission } from "@/types";
import { SubmissionActionCell } from "./cells/submission-action-cell";
import { TextCell } from "./cells/text-cell";
import { t } from "@lingui/macro";

const columnHelper = createColumnHelper<Submission>();
export const columns = [
  columnHelper.accessor("name", {
    id: "name",
    header: () => t`Name`,
    cell: TextCell
  }),
  columnHelper.accessor("description", {
    id: "note",
    header: () => t`Note`,
    cell: TextCell
  }),
  columnHelper.accessor("updated_date", {
    id: "modified",
    header: () => t`Modified`,
    cell: TextCell
  }),
  columnHelper.accessor("author_id", {
    id: "author",
    header: () => t`Author`,
    cell: TextCell
  }),
  columnHelper.accessor("app_id", {
    id: "app-actions",
    size: 32,
    header: "",
    cell: SubmissionActionCell
  })
];
