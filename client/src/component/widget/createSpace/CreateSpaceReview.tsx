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
  const avatar = createSpace.createSpaceDTO.avatar;
  const { color, isPrivate, name } = createSpace.createSpaceDTO;
  const itemBgColor = useColorModeValue("white", "darkMain.100");
  const itemHoverBgColor = useColorModeValue("lightMain.100", "darkMain.300");

  const lookUpTitle: Record<keyof CreateSpaceDTO, string> = {
    color: "",
    teamId: "",
    orderIndex: "",
    avatar: "Avatar",
    name: "Space name",
    isPrivate: "Private setting",
    statusColumnsCategoryId: "Task statuses",
  };

  const lookUpStep: Record<keyof CreateSpaceDTO, CreateSpaceStep | null> = {
    color: null,
    teamId: null,
    orderIndex: null,
    name: CreateSpaceStep.NAME,
    avatar: CreateSpaceStep.COLOR,
    isPrivate: CreateSpaceStep.IS_PRIVATE,
    statusColumnsCategoryId: CreateSpaceStep.STATUS_COLUMNS,
  };

  const avatarDisplay = (
    <Center
      pb="2px"
      width="20px"
      rounded="md"
      height="20px"
      fontSize="12px"
      bgColor={color}
      fontWeight="semibold"
      backgroundSize="cover"
      backgroundImage={avatar}
    >
      {!avatar ? name[0] : ""}
    </Center>
  );

  const statusColumnDisplay = (
    <>
      {createSpace.selectedStatusColumns.map((column) => (
        <Tooltip
          hasArrow
          rounded="md"
          arrowSize={5}
          key={column.id}
          fontSize="13px"
          placement="top"
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
  );

  const lookUpContent: Record<keyof CreateSpaceDTO, JSX.Element | null> = {
    color: null,
    teamId: null,
    orderIndex: null,
    name: <Box>{name}</Box>,
    avatar: avatarDisplay,
    statusColumnsCategoryId: statusColumnDisplay,
    isPrivate: isPrivate ? <Box>Private</Box> : <Box>Public</Box>,
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
                <Center fontWeight="semibold" fontSize="13px">
                  {title}
                </Center>

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
