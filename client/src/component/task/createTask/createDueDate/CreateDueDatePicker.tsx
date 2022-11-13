import { TextField } from "@mui/material";
import { StaticDatePicker } from "@mui/x-date-pickers";
import { SetState } from "immer/dist/internal";
import { memo } from "react";
import useAuthContext from "../../../../context/auth/useAuthContext";
import useTaskDetailContext from "../../../../context/task_detail/useTaskDetailContext";
import { ColumnOptions, SortBy } from "../../../../types";
import MaterialTheme from "../../../test-dev/MaterialTheme";
import { getDueDateFromExpectedDueDateString } from "../../actions/taskProcessing";

type Props = {
  onClose: () => void;
  expectedDueDate: Date | null;
  setExpectedDueDate: React.Dispatch<React.SetStateAction<Date | null>>;
};

function CreateDueDatePicker({
  onClose,
  expectedDueDate,
  setExpectedDueDate,
}: Props) {
  const { authState } = useAuthContext();
  const { taskStateContext } = useTaskDetailContext();
  const { setState, sortBy, columnOptions } = taskStateContext!;

  return (
    <MaterialTheme>
      <StaticDatePicker
        value={expectedDueDate}
        displayStaticWrapperAs="desktop"
        renderInput={(params) => <TextField {...params} />}
        onChange={(newValue) => {
          if (newValue) {
            setExpectedDueDate(newValue);

            handleDatePicker(
              authState.user!.id,
              sortBy,
              onClose,
              columnOptions,
              newValue
            );
          }
        }}
      />
    </MaterialTheme>
  );
}

export default memo(CreateDueDatePicker);

function handleDatePicker(
  userId: number,
  sortBy: SortBy,
  onClose: () => void,
  columnOptions: ColumnOptions,
  expectedDueDateInput: Date
) {
  if (expectedDueDateInput) {
    const targetDueDateColumnId = getDueDateFromExpectedDueDateString(
      columnOptions.dueDate,
      expectedDueDateInput
    );

    onClose();
  }
}
