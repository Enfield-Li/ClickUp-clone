import { Box, Flex, useColorMode } from "@chakra-ui/react";
import { memo } from "react";
import useAuthContext from "../../../context/auth/useAuthContext";
import FolderAndList from "./folderAndList/FolderAndList";
import Spaces from "./Spaces";

type Props = {};

export default memo(SubNavbarContent);
function SubNavbarContent({}: Props) {
  const { authState } = useAuthContext();
  const { colorMode } = useColorMode();

  return (
    <Box color="lightMain.200" fontWeight="semibold" pl="10px" pr="3">
      <Flex height="35px" alignItems="center" cursor="pointer" pl="2">
        <Box>Spaces</Box>
      </Flex>

      <Flex
        py="1"
        pl="2"
        rounded="4px"
        cursor="pointer"
        alignItems="center"
        _hover={{
          bgColor: colorMode === "dark" ? "darkMain.300" : "darkMain.200",
        }}
      >
        <Box mr="1">
          <i className="bi bi-grid"></i>
        </Box>
        <Box>Everything</Box>
      </Flex>

      <Box>
        {authState.user?.spaces.map((space) => (
          <Box key={space.id}>
            <Spaces space={space} />

            {space.isOpen &&
              space.allList.map((folder) => (
                <Box key={folder.id}>
                  <FolderAndList folder={folder} />
                </Box>
              ))}
          </Box>
        ))}
      </Box>
    </Box>
  );
}
