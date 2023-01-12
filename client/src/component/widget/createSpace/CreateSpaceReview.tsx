import { Box, Center, Flex, Tooltip } from "@chakra-ui/react";
import produce from "immer";
import { memo } from "react";
import { CreateSpaceState, CreateSpaceStep } from "../../../types";
import CreateSpaceModalTemplate from "./CreateSpaceModalTemplate";
import ReviewCreateSpaceItem from "./ReviewCreateSpaceItem";

type Props = {
  createSpace: CreateSpaceState;
  setCreateSpace: React.Dispatch<React.SetStateAction<CreateSpaceState>>;
};

export default memo(CreateSpaceReview);
function CreateSpaceReview({ createSpace, setCreateSpace }: Props) {
  const avatar = createSpace.createSpaceDTO.avatar;
  const { color, isPrivate, name } = createSpace.createSpaceDTO;

  function handleClick(createSpaceStep: CreateSpaceStep | null): void {
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
      <Flex height="100%" flexDir="column" justifyContent="center">
        <Box borderWidth="1px" borderColor="blackAlpha.400">
          <ReviewCreateSpaceItem
            title="Space name"
            handleClick={() => handleClick(CreateSpaceStep.NAME)}
          >
            <Box>{name}</Box>
          </ReviewCreateSpaceItem>

          <ReviewCreateSpaceItem
            title="Avatar"
            handleClick={() => handleClick(CreateSpaceStep.COLOR)}
          >
            <Center
              width="20px"
              rounded="md"
              height="20px"
              fontSize="12px"
              bgColor={color}
              fontWeight="semibold"
              backgroundSize="cover"
              backgroundImage={avatar}
            >
              {!avatar ? name[0].toUpperCase() : ""}
            </Center>
          </ReviewCreateSpaceItem>

          <ReviewCreateSpaceItem
            title="Private setting"
            handleClick={() => handleClick(CreateSpaceStep.IS_PRIVATE)}
          >
            {isPrivate ? <Box>Private</Box> : <Box>Public</Box>}
          </ReviewCreateSpaceItem>

          <ReviewCreateSpaceItem
            title="Task statuses"
            handleClick={() => handleClick(CreateSpaceStep.STATUS_COLUMNS)}
          >
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
          </ReviewCreateSpaceItem>
        </Box>
      </Flex>
    </CreateSpaceModalTemplate>
  );
}
