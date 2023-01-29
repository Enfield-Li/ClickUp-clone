import produce from "immer";
import {
  updateStatusColumnTitle,
  updateStatusColumnColor,
  deleteStatusColumn,
  updateStatusColumn,
} from "../../../networkCalls";
import {
  UpdateStatusColumnTitleDTO,
  UpdateStatusColumnColorDTO,
  StatusCategoryState,
  StatusColumn,
  StatusCategory,
  UpdateStatusColumnDTO,
} from "../../../types";

type Params = {
  dto: UpdateStatusColumnDTO;
  currentStatusColumn: StatusColumn;
  selectedCategory?: StatusCategory;
  setStatusCategoryState: React.Dispatch<
    React.SetStateAction<StatusCategoryState>
  >;
};

export function updateStatusColumnNetworkReturns({
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

// export function handleSelectColor({
//   title,
//   selectedCategory,
//   currentStatusColumn,
//   setStatusCategoryState,
// }: Params) {
//   const dto: UpdateStatusColumnColorDTO = {
//     id: currentStatusColumn.id!,
//     color: selectedColor,
//   };

//   updateStatusColumnColor(dto, () => {
//     setStatusCategoryState((prev) =>
//       produce(prev, (draftState) => {
//         draftState.categories.forEach((category) => {
//           if (category.id === selectedCategory?.id) {
//             category.statusColumns.forEach((column) => {
//               if (column.id === currentStatusColumn.id) {
//                 column.color = selectedColor;
//               }
//             });
//           }
//         });
//       })
//     );
//   });
// }
