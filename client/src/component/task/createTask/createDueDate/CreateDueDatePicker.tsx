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
  expectedDueDate: Date | undefined;
  setExpectedDueDate: React.Dispatch<React.SetStateAction<Date | undefined>>;
};

function CreateDueDatePicker({
  onClose,
  expectedDueDate,
  setExpectedDueDate,
}: Props) {
  function handleOnChange(newValue: Date) {
    onClose();
    if (newValue) {
      setExpectedDueDate(newValue);
    }
  }

  return (
    <MaterialTheme>
      <StaticDatePicker
        value={expectedDueDate}
        displayStaticWrapperAs="desktop"
        renderInput={(params) => <TextField {...params} />}
        onChange={(newValue) => newValue && handleOnChange(newValue)}
      />
    </MaterialTheme>
  );
}

export default memo(CreateDueDatePicker);
