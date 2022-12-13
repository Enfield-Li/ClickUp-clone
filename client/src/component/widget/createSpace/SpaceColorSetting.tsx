import { NotAllowedIcon } from "@chakra-ui/icons";
import { Box, Center, Flex, Text } from "@chakra-ui/react";
import produce from "immer";
import { memo } from "react";
import { CreateSpace } from "../../../types";
import { spaceColors2D } from "../../../media/colors";

type Props = {
  createSpace: CreateSpace;
  setCreateSpace: React.Dispatch<React.SetStateAction<CreateSpace>>;
};

export default memo(SpaceColorSetting);
function SpaceColorSetting({ createSpace, setCreateSpace }: Props) {
  const mx = "6.8px";
  function handleCancelColor() {
    setCreateSpace(
      produce(createSpace, (draftState) => {
        draftState.createSpaceDTO.color = "gray";
      })
    );
  }

  function handlePickColor(color: string) {
    setCreateSpace(
      produce(createSpace, (draftState) => {
        draftState.createSpaceDTO.color = color;
      })
    );
  }

  return (
    <Flex alignItems="center" height="100%">
      <Center
        mr="6"
        color="white"
        width="140px"
        rounded="35px"
        height="140px"
        fontSize="35px"
        bgColor={createSpace.createSpaceDTO.color}
      >
        {createSpace.createSpaceDTO.name[0].toUpperCase()}
      </Center>

      <Box flexGrow="1" pl="6">
        <Text
          opacity="50%"
          fontSize="12px"
          letterSpacing="wide"
          fontWeight="semibold"
        >
          SPACE COLOR
        </Text>

        {spaceColors2D.map((colorGroup, index) => (
          <Flex my="6" key={index}>
            {index === 0 && (
              <NotAllowedIcon
                mx={mx}
                rounded="4px"
                width="15px"
                height="15px"
                cursor="pointer"
                onClick={handleCancelColor}
              />
            )}

            {colorGroup.map((color, index) => (
              <Box
                mx={mx}
                key={index}
                rounded="4px"
                width="15px"
                height="15px"
                bgColor={color}
                cursor="pointer"
                onClick={() => handlePickColor(color)}
              ></Box>
            ))}
          </Flex>
        ))}
      </Box>
    </Flex>
  );
}
