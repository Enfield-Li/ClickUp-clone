import TextField from "@mui/material/TextField";
import * as React from "react";

import dayjs, { Dayjs } from "dayjs";
import { StaticDatePicker } from "@mui/x-date-pickers/StaticDatePicker";
import MaterialTheme from "./MaterialTheme";
import { Box, Flex } from "@chakra-ui/react";

export default function BasicDatePicker() {
  const [value, setValue] = React.useState<Dayjs | null>(dayjs());
  console.log(value?.toDate());

  return (
    <Flex bgColor="gray">
      <Box>abc</Box>

      <MaterialTheme>
        <StaticDatePicker
          value={value}
          displayStaticWrapperAs="desktop"
          onChange={(newValue) => setValue(newValue)}
          renderInput={(params) => <TextField {...params} />}
        />
      </MaterialTheme>
    </Flex>
  );
}
