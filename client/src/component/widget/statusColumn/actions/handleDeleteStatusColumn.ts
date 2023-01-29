import produce from "immer";
import { deleteStatusColumn } from "../../../../networkCalls";
import {
  StatusColumn,
  StatusCategory,
  StatusCategoryState,
} from "../../../../types";

type handleDeleteStatusColumnParams = {
  currentStatusColumn: StatusColumn;
  selectedCategory?: StatusCategory;
  setStatusCategoryState: React.Dispatch<
    React.SetStateAction<StatusCategoryState>
  >;
};

export function handleDeleteStatusColumn({
  selectedCategory,
  currentStatusColumn,
  setStatusCategoryState,
}: handleDeleteStatusColumnParams) {
  deleteStatusColumn(currentStatusColumn.id!, () => {
    setStatusCategoryState((prev) =>
      produce(prev, (draftState) => {
        draftState.categories.forEach((category, index, arr) => {
          if (category.id === selectedCategory?.id) {
            category.statusColumns.forEach((statusColumn, index, arr) => {
              if (statusColumn.id === currentStatusColumn.id) {
                arr.splice(index, 1);
              }
            });
          }
        });
      })
    );
  });
}
