import { TextField } from "@mui/material";
import { StaticDatePicker } from "@mui/x-date-pickers";
import { memo } from "react";
import MaterialTheme from "../../../test-dev/MaterialTheme";

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
