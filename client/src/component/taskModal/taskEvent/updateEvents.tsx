import { Box, Flex } from "@chakra-ui/react";
import useAuthContext from "../../../context/auth/useAuthContext";
import { calculateTime } from "../../../utils/calculateTime";
import { UpdateEvent } from "../../../types";
import BeforeAndAfter from "./BeforeAndAfter";
import { memo } from "react";

type Props = { updateEvent: UpdateEvent };

export default memo(UpdateEvents);
function UpdateEvents({ updateEvent }: Props) {
  const { authState } = useAuthContext();

  return (
    <Flex justifyContent="space-between" fontSize="small">
      <Flex alignItems="center">
        {/* Someone */}
        <Box
          p={1}
          rounded="sm"
          cursor="pointer"
          _hover={{
            backgroundSize: "120% 120%",
            backgroundColor: "blackAlpha.300",
          }}
        >
          {authState.user!.id === updateEvent.userId ? (
            <Box color="purple.400">You</Box>
          ) : (
            <Box opacity="65%">{updateEvent.username}</Box>
          )}
        </Box>

        {/* changed something from */}
        <Box opacity="65%">
          <span>&nbsp;</span>changed {updateEvent.field} from
          <span>&nbsp;</span>
        </Box>

        {/* Before */}
        {updateEvent.beforeUpdate ? (
          <BeforeAndAfter
            updateEvent={updateEvent}
            beforeOrAfterUpdate="beforeUpdate"
          />
        ) : (
          <span>None</span>
        )}

        {/* to */}
        <Box opacity="65%">
          <span>&nbsp;</span>to<span>&nbsp;</span>
        </Box>

        {/* After */}
        <BeforeAndAfter
          updateEvent={updateEvent}
          beforeOrAfterUpdate="afterUpdate"
        />
      </Flex>

      <Box opacity="65%">{calculateTime(updateEvent.createdAt!)}</Box>
    </Flex>
  );
}
