import { Box, Center } from "@chakra-ui/react";
import useModalControlContext from "../../../context/modalControl/useModalControlContext";

type Props = {};

export default function CreateSpacePanel({}: Props) {
  const { onCreateSpaceModalOpen } = useModalControlContext();

  return (
    <Center
      opacity="60%"
      flexDir="column"
      cursor="pointer"
      onClick={onCreateSpaceModalOpen}
    >
      <Center
        mb="6"
        width="100px"
        height="100px"
        rounded="full"
        fontSize="40px"
        borderWidth="2px"
        fontWeight="light"
        borderStyle="dashed"
        borderColor="lightMain.100"
        _hover={{ color: "purple.400", borderColor: "purple.400" }}
      >
        <i className="bi bi-plus-lg"></i>
      </Center>

      <Center flexGrow={1} fontSize="20px" fontWeight="semibold">
        No Space selected
      </Center>
    </Center>
  );
}
