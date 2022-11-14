import {
  Box,
  Center,
  Flex,
  Popover,
  PopoverBody,
  PopoverContent,
  PopoverTrigger,
  Tooltip,
  useColorModeValue,
} from "@chakra-ui/react";
import { memo, useState } from "react";
import useAuthContext from "../../../../context/auth/useAuthContext";
import useTaskDetailContext from "../../../../context/task_detail/useTaskDetailContext";
import {
  getMonthAndDay,
  toYYYYMMDDString,
} from "../../../../utils/getWeekDays";
import CreateDueDatePanel from "./CreateDueDatePanel";

type Props = {
  expectedDueDate: Date | undefined;
  setExpectedDueDate: React.Dispatch<React.SetStateAction<Date | undefined>>;
};

function CreateExpectedDueDateDisplay({
  expectedDueDate,
  setExpectedDueDate,
}: Props) {
  const [showDeleteButton, setShowDeleteButton] = useState(false);

  const popoverContentBg = useColorModeValue("white", "darkMain.100");
  const popoverContentColor = useColorModeValue(
    "darkMain.400",
    "lightMain.200"
  );

  return (
    <Flex
      cursor="pointer"
      alignItems="center"
      width="fit-content"
      justifyContent="center"
      _hover={{ textDecoration: "underline" }}
      onMouseOverCapture={() => setShowDeleteButton(true)}
      onMouseOutCapture={() => setShowDeleteButton(false)}
    >
      <Popover>
        {({ onClose, isOpen: isOptionOpen }) => (
          // https://chakra-ui.com/docs/components/popover/usage#accessing-internal-state
          <>
            <Tooltip
              my={2}
              hasArrow
              placement="top"
              fontWeight="semibold"
              label={
                <Box>
                  Time:&nbsp;
                  {toYYYYMMDDString(new Date(expectedDueDate!))}
                </Box>
              }
            >
              <Box display="inline-block">
                <PopoverTrigger>
                  <Center opacity="65%" fontSize="14px">
                    {getMonthAndDay(new Date(expectedDueDate!))}
                  </Center>
                </PopoverTrigger>
              </Box>
            </Tooltip>

            {/* DueDate option */}
            <PopoverContent
              width="383px"
              borderRadius="0px"
              bgColor={popoverContentBg}
              color={popoverContentColor}
            >
              <PopoverBody shadow={"2xl"} p={0}>
                <CreateDueDatePanel
                  onClose={onClose}
                  expectedDueDate={expectedDueDate}
                  setExpectedDueDate={setExpectedDueDate}
                />
              </PopoverBody>
            </PopoverContent>
          </>
        )}
      </Popover>

      {/* Delete button */}
      {showDeleteButton && (
        <Center
          ml={1}
          width="12px"
          height="12px"
          rounded="full"
          bgColor="customBlue.200"
          onClick={() => setExpectedDueDate(undefined)}
        >
          <Center fontWeight="extrabold" color="white">
            <i className="bi bi-x"></i>
          </Center>
        </Center>
      )}
    </Flex>
  );
}
export default memo(CreateExpectedDueDateDisplay);
