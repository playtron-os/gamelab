import React from "react";
import { AppInformation, PlaytronImage } from "@/types/app-library";
import { CellContext } from "@tanstack/react-table";
import { getImage } from "@/utils/app-info";

export const ImageCell = (
  info: CellContext<AppInformation, PlaytronImage[]>
) => {
  const imageUrl = getImage(info.getValue());
  return imageUrl ? (
    <img
      src={imageUrl}
      alt=""
      loading="lazy"
      className="rounded-l-lg h-full w-[100px] object-cover"
    />
  ) : null;
};
