import { Box, Center } from "@chakra-ui/react";
import useTeamStateContext from "../../../context/team/useTeamContext";

type Props = {};

export default function CreateSpacePanel({}: Props) {
  const {
    teamState,
    modalControls: { onCreateSpaceModalOpen },
  } = useTeamStateContext();

  return (
    <Box opacity="60%" onClick={onCreateSpaceModalOpen}>
      <Center
        mb="6"
        width="100px"
        height="100px"
        rounded="full"
        fontSize="40px"
        cursor="pointer"
        borderWidth="2px"
        fontWeight="light"
        borderStyle="dashed"
        borderColor="lightMain.100"
        _hover={{ color: "purple.400", borderColor: "purple.400" }}
      >
        <i className="bi bi-plus-lg"></i>
      </Center>

      <Center flexGrow={1} fontSize="20px" fontWeight="semibold">
        No Space
      </Center>
    </Box>
  );
}
