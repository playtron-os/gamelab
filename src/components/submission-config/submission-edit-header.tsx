import React from "react";
import { Button, CloseFill } from "@playtron/styleguide";

interface SubmissionEditHeaderProps {
  title: string;
  onClose: () => void;
}

export const SubmissionEditHeader: React.FC<SubmissionEditHeaderProps> = ({
  title,
  onClose
}) => {
  return (
    <div className="bg-[--fill-subtle] flex align-middle font-bold text-2xl items-center ">
      <div className="flex-grow p-3 ps-5">{title}</div>
      <div className="flex-shrink p-3 pe-5">
        <Button
          onClick={() => onClose()}
          Icon={CloseFill}
          size="medium"
          className="px-3"
        />
      </div>
    </div>
  );
};
