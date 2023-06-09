import { Box, Button, Center, Img } from "@chakra-ui/react";
import { memo } from "react";
import { useModalControl } from "../../../context/modalControl/useModalControl";
import { emptySpaceImgDisplayDataUrl } from "../../../media/imgDataUrl";

type Props = {};

export default memo(CreateListPanel);
function CreateListPanel({}: Props) {
  const { onCreateListModalOpen } = useModalControl();

  return (
    <Center flexDir="column">
      <Box opacity="80%">
        <Img src={emptySpaceImgDisplayDataUrl} />
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
        onClick={onCreateListModalOpen}
        _hover={{ bgColor: "customBlue.100" }}
        _active={{}}
        _focus={{}}
      >
        + Create List
      </Button>
    </Center>
  );
}
