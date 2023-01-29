import {
  StatusColumn,
  StatusCategory,
  StatusCategoryState,
  UpdateStatusColumnDTO,
} from "../../../../types";
import { updateStatusColumnAfterNetworkSuccess } from "./updateStatusColumnAfterNetworkSuccess";

type handleSelectColorParams = {
  selectedColor: string;
  currentStatusColumn: StatusColumn;
  selectedCategory?: StatusCategory;
  setStatusCategoryState: React.Dispatch<
    React.SetStateAction<StatusCategoryState>
  >;
};

export function handleSelectColor({
  selectedColor,
  selectedCategory,
  currentStatusColumn,
  setStatusCategoryState,
}: handleSelectColorParams) {
  const { id, orderIndex, color } = currentStatusColumn;

  const dto: UpdateStatusColumnDTO = {
    id: id!,
    color: selectedColor,
    orderIndex: orderIndex,
    title: currentStatusColumn.title,
  };

  updateStatusColumnAfterNetworkSuccess({
    dto,
    selectedCategory,
    currentStatusColumn,
    setStatusCategoryState,
  });
}
