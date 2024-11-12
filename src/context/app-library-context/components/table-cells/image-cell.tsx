import React from "react";
import { AppInformation, PlaytronImage } from "@/types/app-library";
import { CellContext } from "@tanstack/react-table";
import { getImage } from "@/utils/app-info";

export const ImageCell = (
  info: CellContext<AppInformation, PlaytronImage[]>
) => {
  const imageUrl = getImage(info.getValue());
  return imageUrl ? (
    <div className="flex justify-center mx-2 w-[100px] h-[48px]">
      <img
        src={imageUrl}
        alt=""
        loading="lazy"
        className="h-full w-full max-h-[48px] max-w-[100px] object-cover"
      />
    </div>
  ) : null;
};
