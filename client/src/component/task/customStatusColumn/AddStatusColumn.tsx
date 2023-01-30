import {
  Box,
  Center,
  useColorModeValue,
  useDisclosure,
} from "@chakra-ui/react";
import { memo, useState } from "react";
import { getRandomSpaceColor, getRandomTeamColor } from "../../../media/colors";
import { SetTaskState, StatusColumns, TaskState } from "../../../types";
import { getRandomNumber } from "../../../utils/getRandomNumber";
import StatusColorPalletPopover from "../../widget/statusColumn/StatusColorPalletPopover";
import AddStatusColumnInput from "./AddStatusColumnInput";

type Props = {
  statusCategoryId?: number;
  setTaskState: SetTaskState;
  statusColumns: StatusColumns;
};

export default memo(AddStatusColumn);
function AddStatusColumn({
  setTaskState,
  statusColumns,
  statusCategoryId,
}: Props) {
  const {
    isOpen: isColorPalletOpen,
    onOpen: onColorPalletOpen,
    onClose: onColorPalletClose,
  } = useDisclosure();

  const [color, setColor] = useState(getRandomSpaceColor);
  const hoverBgColor = useColorModeValue("white", "darkMain.200");

  return (
    <>
      {isColorPalletOpen ? (
        <>
          {/* Title */}
          <AddStatusColumnInput
            color={color}
            setTaskState={setTaskState}
            statusColumns={statusColumns}
            statusCategoryId={statusCategoryId}
            onColorPalletClose={onColorPalletClose}
          />

          {/* Color pallet */}
          <Center mt={3}>
            <Box shadow="2xl" width="fit-content">
              <StatusColorPalletPopover
                position="bottom"
                handleSelectColor={setColor}
                isColorPalletOpen={isColorPalletOpen}
                onColorPalletClose={onColorPalletClose}
              >
                <Box></Box>
              </StatusColorPalletPopover>
            </Box>
          </Center>
        </>
      ) : (
        <>
          <Center
            p={3}
            height="48px"
            borderTop="2px"
            fontSize="13px"
            minWidth="250px"
            cursor="pointer"
            borderTopRadius="sm"
            onClick={onColorPalletOpen}
            opacity={isColorPalletOpen ? undefined : "70%"}
            _hover={{ boxShadow: "base", bgColor: hoverBgColor }}
          >
            <Box>+ ADD STATUS</Box>
          </Center>
        </>
      )}
    </>
  );
}
