import { Box, Button, Center } from "@chakra-ui/react";
import { memo } from "react";
import EmptySpaceSVG from "../../media/EmptySpaceSVG";

type Props = {};

export default memo(CreateListPanel);
function CreateListPanel({}: Props) {
  return (
    <Center flexDir="column">
      <Box opacity="80%">
        <EmptySpaceSVG />
      </Box>

      <Box mt="3" mb="4" color="lightMain.300">
        This Space is empty. Create a List to get started.
      </Box>

      <Button
        rounded="sm"
        width="135px"
        fontSize="small"
        color="lightMain.100"
        fontWeight="semibold"
        bgColor="customBlue.200"
        _hover={{ bgColor: "customBlue.100" }}
        _active={{}}
        _focus={{}}
      >
        + Create List
      </Button>
    </Center>
  );
}
