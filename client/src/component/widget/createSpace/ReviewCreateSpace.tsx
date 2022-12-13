import {
  Box,
  Center,
  Flex,
  Tooltip,
  useColorModeValue,
} from "@chakra-ui/react";
import produce from "immer";
import { memo } from "react";
import {
  CreateSpace,
  CreateSpaceDTO,
  CreateSpaceStep,
} from "../../../types";

type Props = {
  createSpace: CreateSpace;
  setCreateSpace: React.Dispatch<React.SetStateAction<CreateSpace>>;
};

export default memo(ReviewCreateSpace);
function ReviewCreateSpace({ createSpace, setCreateSpace }: Props) {
  const { color, isPrivate, name } = createSpace.createSpaceDTO;
  const itemBgColor = useColorModeValue("white", "darkMain.100");
  const itemHoverBgColor = useColorModeValue("lightMain.100", "darkMain.300");

  const lookUpTitle: Record<keyof CreateSpaceDTO, string> = {
    color: "Color",
    orderIndex: "",
    name: "Space name",
    isPrivate: "Private setting",
    defaultStatusColumnId: "Task statuses",
  };

  const lookUpStep: Record<keyof CreateSpaceDTO, CreateSpaceStep | null> = {
    color: CreateSpaceStep.COLOR,
    orderIndex: null,
    name: CreateSpaceStep.NAME,
    isPrivate: CreateSpaceStep.IS_PRIVATE,
    defaultStatusColumnId: CreateSpaceStep.STATUS_COLUMNS,
  };

  function handleRedirect(createSpaceStep: CreateSpaceStep | null): void {
    setCreateSpace(
      produce(createSpace, (draftState) => {
        draftState.step = createSpaceStep;
      })
    );
  }

  const lookUpContent: Record<keyof CreateSpaceDTO, JSX.Element> = {
    color: (
      <Center
        width="20px"
        rounded="md"
        height="20px"
        fontSize="12px"
        bgColor={color}
        fontWeight="semibold"
      >
        {name[0]}
      </Center>
    ),
    orderIndex: <></>,
    name: <Box>{name}</Box>,
    isPrivate: isPrivate ? <Box>Private</Box> : <Box>Public</Box>,
    defaultStatusColumnId: (
      <>
        {createSpace.selectedStatusColumns.map((column) => (
          <Tooltip
            hasArrow
            rounded="md"
            arrowSize={5}
            fontSize="13px"
            placement="top"
            key={column.id}
            label={column.title}
            textTransform="lowercase"
          >
            <Box
              mx="1"
              width="10px"
              rounded="sm"
              height="10px"
              bgColor={column.color}
            ></Box>
          </Tooltip>
        ))}
      </>
    ),
  };

  return (
    <Flex pt="6" height="100%" flexDir="column" justifyContent="center">
      {Object.entries(createSpace.createSpaceDTO).map((kvPair, index) => {
        const key = kvPair[0] as keyof CreateSpaceDTO;

        return (
          key !== "orderIndex" && (
            <Flex
              px="3"
              key={index}
              height="50px"
              cursor="pointer"
              borderWidth="1px"
              bgColor={itemBgColor}
              borderColor="blackAlpha.400"
              justifyContent="space-between"
              _hover={{ bgColor: itemHoverBgColor }}
              borderTopRadius={key === "name" ? "sm" : ""}
              onClick={() => handleRedirect(lookUpStep[key])}
              borderBottomRadius={key === "isPrivate" ? "sm" : ""}
            >
              <Center fontWeight="semibold">{lookUpTitle[key]}</Center>

              <Flex alignItems="center" fontSize="12px" fontWeight="semibold">
                {lookUpContent[key]}
              </Flex>
            </Flex>
          )
        );
      })}
    </Flex>
  );
}
