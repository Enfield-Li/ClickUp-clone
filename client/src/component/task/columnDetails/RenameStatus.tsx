import { Box } from "@chakra-ui/react";
import React from "react";
import SelectOption from "../select/SelectOption";
import { SetState, ColumnType } from "../taskTypes";

type Props = {
  onClose: () => void;
  setEditTitle: React.Dispatch<React.SetStateAction<boolean>>;
};

export default function RenameStatus({ onClose, setEditTitle }: Props) {
  return (
    <Box
      onClick={() => {
        setEditTitle(true);
        onClose();
      }}
    >
      <SelectOption optionName="Rename status" backgroundColor="gray.400">
        <i className="bi bi-pencil"></i>
      </SelectOption>
    </Box>
  );
}
