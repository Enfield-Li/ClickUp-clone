import { Box } from "@chakra-ui/react";
import React from "react";
import {
  StatusCategory,
  StatusCategoryState,
  StatusColumn,
} from "../../../types";
import { handleDeleteStatusColumn } from "./actions/handleDeleteStatusColumn";
import StatusColumnOption from "./StatusColumnOption";
import StatusColumnOptionPopover from "./StatusColumnOptionPopover";

type Props = {
  onColorPalletOpen: () => void;
  selectedCategory?: StatusCategory;
  currentStatusColumn: StatusColumn;
  setStatusCategoryState: React.Dispatch<
    React.SetStateAction<StatusCategoryState>
  >;
  setEditing: React.Dispatch<React.SetStateAction<boolean>>;
};

export default function ActiveStatusOptions({
  setEditing,
  selectedCategory,
  onColorPalletOpen,
  currentStatusColumn,
  setStatusCategoryState,
}: Props) {
  function handleOpenColorPallet(
    e: React.MouseEvent<HTMLDivElement, MouseEvent>
  ) {
    e.stopPropagation();
    onColorPalletOpen();
  }

  function onClickHandler() {
    handleDeleteStatusColumn({
      selectedCategory,
      currentStatusColumn,
      setStatusCategoryState,
    });
  }

  return (
    <StatusColumnOptionPopover>
      {/* Rename */}
      <StatusColumnOption onClickHandler={() => setEditing(true)}>
        <i className="bi bi-pen"></i>
        <Box ml="10px">Rename</Box>
      </StatusColumnOption>

      {/* Change color */}
      {!currentStatusColumn.markAsClosed && (
        <StatusColumnOption onClickHandler={handleOpenColorPallet}>
          <i className="bi bi-palette-fill"></i>
          <Box ml="10px">Change Color</Box>
        </StatusColumnOption>
      )}

      {/* Delete */}
      {!currentStatusColumn.isDefaultStatus &&
        !currentStatusColumn.markAsClosed && (
          <StatusColumnOption onClickHandler={onClickHandler}>
            <i className="bi bi-trash"></i>
            <Box ml="10px">Delete Status</Box>
          </StatusColumnOption>
        )}
    </StatusColumnOptionPopover>
  );
}
