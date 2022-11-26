import { Box, Center, Flex, useColorModeValue } from "@chakra-ui/react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { CLIENT_ROUTE } from "../../../constant";
import useAuthContext from "../../../context/auth/useAuthContext";

type Props = {};

export default function SubNavbarContent({}: Props) {
  const { authState } = useAuthContext();
  const navigate = useNavigate();
  const textColor = useColorModeValue("darkMain.400", "lightMain.200");

  function handleNavigateToList(
    e: React.MouseEvent<HTMLDivElement, MouseEvent>,
    listId: number
  ) {
    e.stopPropagation();
    navigate(CLIENT_ROUTE.TASK + `/${listId}`);
  }

  return (
    <Box color={textColor} fontWeight="semibold" px="3">
      <Flex height="35px" alignItems="center">
        <Box>Spaces</Box>
      </Flex>

      <Box>
        {authState.user?.spaces.map((space) => (
          <Box key={space.id}>
            {space.allList.map((list) => (
              <Box key={list.id}>
                <Box
                  cursor="pointer"
                  onClick={(e) => handleNavigateToList(e, list.id)}
                >
                  {list.name}
                </Box>
              </Box>
            ))}
          </Box>
        ))}
      </Box>
    </Box>
  );
}
