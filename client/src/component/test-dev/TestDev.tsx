import * as React from "react";

import { Box } from "@chakra-ui/react";
import dayjs, { Dayjs } from "dayjs";
import LogoSVG from "../../media/LogoSVG";

export default function BasicDatePicker() {
  const [value, setValue] = React.useState<Dayjs | null>(dayjs());
  console.log(value?.toDate());

  return (
    <Box transform="scale(0.2)" width="fit-content" height="fit-content">
      <LogoSVG />
    </Box>
  );
}
