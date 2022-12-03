import TextField from "@mui/material/TextField";
import * as React from "react";

import dayjs, { Dayjs } from "dayjs";
import { StaticDatePicker } from "@mui/x-date-pickers/StaticDatePicker";
import MaterialTheme from "./MaterialTheme";
import { Box, Flex } from "@chakra-ui/react";
import { spaceColors3D } from "../layout/subNavbar/createSpace/utils/colors";

export default function BasicDatePicker() {
  const [value, setValue] = React.useState<Dayjs | null>(dayjs());
  console.log(value?.toDate());

  return (
    <Box>
      {spaceColors3D.map((colors, index) => (
        <Flex key={index}>
          {colors.map((color, index) => (
            <Box
              mr="6px"
              key={index}
              width="10px"
              rounded="sm"
              height="10px"
              bgColor={color}
            ></Box>
          ))}
        </Flex>
      ))}
    </Box>
  );
}
