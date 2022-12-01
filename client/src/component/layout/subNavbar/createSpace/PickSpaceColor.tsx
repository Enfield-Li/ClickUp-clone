import { NotAllowedIcon } from "@chakra-ui/icons";
import { Box, Center, Flex, useColorModeValue } from "@chakra-ui/react";
import produce from "immer";
import React from "react";
import { spaceColors } from "./colors";
import { CreateSpace, Step } from "./CreateSpaceModal";
import CreateSpaceModalTemplate from "./CreateSpaceModalTemplate";

type Props = {
  createSpace: CreateSpace;
  setCreateSpace: React.Dispatch<React.SetStateAction<CreateSpace>>;
};

export default function PickSpaceColor({ createSpace, setCreateSpace }: Props) {
  function handleCancelColor() {
    setCreateSpace(
      produce(createSpace, (draftState) => {
        draftState.createSpaceDTO.color = "";
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
    <CreateSpaceModalTemplate
      sectionName="Space color"
      createSpace={createSpace}
      previousSection={Step.NAME}
      setCreateSpace={setCreateSpace}
    >
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

        <Box flexGrow="1">
          {spaceColors.map((colorGroup, index) => (
            <Flex my="6" key={index}>
              {index === 0 && (
                <NotAllowedIcon
                  mx="1"
                  rounded="4px"
                  width="15px"
                  height="15px"
                  cursor="pointer"
                  onClick={handleCancelColor}
                  //   _hover={{ width: "18px", height: "18px" }}
                />
              )}

              {colorGroup.map((color, index) => (
                <Box
                  mx="1"
                  key={index}
                  rounded="4px"
                  width="15px"
                  height="15px"
                  bgColor={color}
                  cursor="pointer"
                  onClick={() => handlePickColor(color)}
                  //   _hover={{ width: "18px", height: "18px" }}
                ></Box>
              ))}
            </Flex>
          ))}
        </Box>
      </Flex>
    </CreateSpaceModalTemplate>
  );
}
