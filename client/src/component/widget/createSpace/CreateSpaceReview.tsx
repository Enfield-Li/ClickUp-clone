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
  CreateSpaceState,
  CreateSpaceDTO,
  CreateSpaceStep,
} from "../../../types";
import CreateSpaceModalTemplate from "./CreateSpaceModalTemplate";

type Props = {
  createSpace: CreateSpaceState;
  setCreateSpace: React.Dispatch<React.SetStateAction<CreateSpaceState>>;
};

export default memo(CreateSpaceReview);
function CreateSpaceReview({ createSpace, setCreateSpace }: Props) {
  const { color, isPrivate, name } = createSpace.createSpaceDTO;
  const itemBgColor = useColorModeValue("white", "darkMain.100");
  const itemHoverBgColor = useColorModeValue("lightMain.100", "darkMain.300");

  const lookUpTitle: Record<keyof CreateSpaceDTO, string> = {
    teamId: "0",
    color: "Color",
    orderIndex: "",
    name: "Space name",
    isPrivate: "Private setting",
    statusColumnsCategoryId: "Task statuses",
  };

  const lookUpStep: Record<keyof CreateSpaceDTO, CreateSpaceStep | null> = {
    teamId: null,
    orderIndex: null,
    name: CreateSpaceStep.NAME,
    color: CreateSpaceStep.COLOR,
    isPrivate: CreateSpaceStep.IS_PRIVATE,
    statusColumnsCategoryId: CreateSpaceStep.STATUS_COLUMNS,
  };

  const lookUpContent: Record<keyof CreateSpaceDTO, JSX.Element | null> = {
    teamId: null,
    orderIndex: null,
    name: <Box>{name}</Box>,
    isPrivate: isPrivate ? <Box>Private</Box> : <Box>Public</Box>,
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
    statusColumnsCategoryId: (
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

  function handleRedirect(createSpaceStep: CreateSpaceStep | null): void {
    setCreateSpace(
      produce(createSpace, (draftState) => {
        draftState.step = createSpaceStep;
      })
    );
  }

  return (
    <CreateSpaceModalTemplate
      nextSection={null}
      sectionName="All good?"
      createSpace={createSpace}
      setCreateSpace={setCreateSpace}
      previousSection={CreateSpaceStep.STATUS_COLUMNS}
    >
      <Flex pt="6" height="100%" flexDir="column" justifyContent="center">
        {Object.entries(createSpace.createSpaceDTO).map((kvPair, index) => {
          const key = kvPair[0] as keyof CreateSpaceDTO;
          const step = lookUpStep[key];
          const title = lookUpTitle[key];
          const content = lookUpContent[key];

          return (
            content && (
              <Flex
                px="3"
                key={index}
                height="50px"
                cursor="pointer"
                borderWidth="1px"
                bgColor={itemBgColor}
                borderColor="blackAlpha.400"
                justifyContent="space-between"
                onClick={() => handleRedirect(step)}
                _hover={{ bgColor: itemHoverBgColor }}
                borderTopRadius={key === "name" ? "sm" : ""}
                borderBottomRadius={key === "isPrivate" ? "sm" : ""}
              >
                <Center fontWeight="semibold">{title}</Center>

                <Flex alignItems="center" fontSize="12px" fontWeight="semibold">
                  {content}
                </Flex>
              </Flex>
            )
          );
        })}
      </Flex>
    </CreateSpaceModalTemplate>
  );
}
