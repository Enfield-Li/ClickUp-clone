import produce from "immer";
import { updateStatusColumn } from "../../../../networkCalls";
import { UpdateStatusColumnDTO, StatusColumn, StatusCategory, StatusCategoryState } from "../../../../types";

export type Params = {
  dto: UpdateStatusColumnDTO;
  currentStatusColumn: StatusColumn;
  selectedCategory?: StatusCategory;
  setStatusCategoryState: React.Dispatch<
    React.SetStateAction<StatusCategoryState>
  >;
};

export function updateStatusColumnAfterNetworkSuccess({
  dto,
  selectedCategory,
  currentStatusColumn,
  setStatusCategoryState,
}: Params) {
  const { title, color, orderIndex } = dto;

  updateStatusColumn(dto, () =>
    setStatusCategoryState((prev) =>
      produce(prev, (draftState) => {
        draftState.categories.forEach((category) => {
          if (category.id === selectedCategory?.id) {
            category.statusColumns.forEach((column) => {
              if (column.id === currentStatusColumn.id) {
                column.title = title;
                column.color = color;
                column.orderIndex = orderIndex;
              }
            });
          }
        });
      })
    )
  );
}
