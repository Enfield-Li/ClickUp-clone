import { Box, Center, Flex, useColorMode } from "@chakra-ui/react";
import { memo, useState } from "react";
import useSpaceListContext from "../../../../context/spaceList/useSpaceListContext";
import { SpaceType, SPACE_LIST_ACTION } from "../../../../types";

type Props = { space: SpaceType };

export default memo(Space);
function Space({ space }: Props) {
  const { colorMode } = useColorMode();
  const [hover, setHover] = useState(false);
  const { spaceListDispatch } = useSpaceListContext();
  const hoverBgColor = colorMode === "dark" ? "darkMain.300" : "darkMain.200";

  function handleOpenSpace(
    e: React.MouseEvent<HTMLDivElement, MouseEvent>,
    spaceId: number
  ): void {
    spaceListDispatch({
      type: SPACE_LIST_ACTION.UPDATE_OPENED_SPACE,
      payload: { spaceId },
    });
  }

  return (
    <Flex
      py="1"
      cursor="pointer"
      position="relative"
      alignItems="center"
      onMouseLeave={() => setHover(false)}
      onMouseOverCapture={() => setHover(true)}
      onClick={(e) => handleOpenSpace(e, space.id)}
    >
      {/* Drag icon */}
      {/* {hover && (
        <Box position="absolute" left="-16px" color="gray" fontSize="22px">
          <i className="bi bi-grip-vertical"></i>
        </Box>
      )} */}

      {/* Triangle */}
      <Center fontSize="8px" color="gray" mr="1" pl="1">
        {space.isOpen ? (
          <Box>
            <i className="bi bi-caret-down-fill"></i>
          </Box>
        ) : (
          <Box>
            <i className="bi bi-caret-right-fill"></i>
          </Box>
        )}
      </Center>

      <Flex
        py="1"
        pl="4px"
        flexGrow="1"
        rounded="4px"
        alignItems="center"
        _hover={{ bgColor: hoverBgColor }}
      >
        {/* Square */}
        <Center
          ml="1"
          mr="2"
          pb="3.5px"
          width="20px"
          height="20px"
          rounded="4px"
          fontSize="15px"
          fontWeight="bold"
          color="lightMain.200"
          bgColor={space.color ? space.color : "gray"}
        >
          {space.name[0]}
        </Center>

        <Center pb="3px" fontSize="17px">
          {space.name}
        </Center>
      </Flex>
    </Flex>
  );
}
