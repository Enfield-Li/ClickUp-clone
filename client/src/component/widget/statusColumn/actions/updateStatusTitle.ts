import produce from "immer";
import {
  StatusCategory,
  StatusCategoryState,
  StatusColumn,
  UpdateStatusColumnDTO,
} from "../../../../types";
import { updateStatusColumnAfterNetworkSuccess } from "./updateStatusColumnAfterNetworkSuccess";

type updateStatusTitleParams = {
  title: string;
  currentStatusColumn: StatusColumn;
  selectedCategory?: StatusCategory;
  setStatusCategoryState: React.Dispatch<
    React.SetStateAction<StatusCategoryState>
  >;
  setEditing: React.Dispatch<React.SetStateAction<boolean>>;
  setTitle: React.Dispatch<React.SetStateAction<string>>;
};

export function handleUpdateStatusTitle({
  title,
  setTitle,
  setEditing,
  selectedCategory,
  currentStatusColumn,
  setStatusCategoryState,
}: updateStatusTitleParams) {
  const isSettingToOriginal = title === currentStatusColumn.title;
  if (isSettingToOriginal) {
    return;
  }

  const isTitleExist = selectedCategory?.statusColumns.some(
    (column) => column.title.toLowerCase() === title.toLowerCase()
  );
  if (isTitleExist) {
    setEditing(false);
    setTitle(currentStatusColumn.title);
    setStatusCategoryState((prev) =>
      produce(prev, (draftState) => {
        draftState.errorMsg = "WHOOPS! STATUS NAME IS ALREADY TAKEN";
      })
    );
    return;
  }

  const { id, orderIndex, color } = currentStatusColumn;
  const dto: UpdateStatusColumnDTO = {
    id: id!,
    orderIndex: orderIndex,
    color,
    title,
  };

  updateStatusColumnAfterNetworkSuccess({
    dto,
    selectedCategory,
    currentStatusColumn,
    setStatusCategoryState,
  });
}
