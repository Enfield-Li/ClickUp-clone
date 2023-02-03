import {
  Box,
  Center,
  Flex,
  Input,
  InputGroup,
  InputRightElement,
} from "@chakra-ui/react";
import produce from "immer";
import React, { useEffect, useState } from "react";
import { CreateFolderState, CreateFolderStep } from "../../../types";
import CreateFolderTemplate from "./CreateFolderTemplate";

type Props = {
  createFolderState: CreateFolderState;
  setCreateFolderState: React.Dispatch<React.SetStateAction<CreateFolderState>>;
};

export default function CreateFolderSelectList({
  createFolderState,
  setCreateFolderState,
}: Props) {
  const [input, setInput] = useState("");
  const [error, setError] = useState(false);

  const isListNameExist = createFolderState.createFolderDTO.allListNames.find(
    (listName) => listName === input
  );

  useEffect(() => {
    if (error) {
      setTimeout(() => {
        setError(false);
      }, 2000);
    }
  }, [error]);

  useEffect(() => {
    if (input && isListNameExist) {
      setError(true);
    }
  }, [input]);

  function handleInputOnChange(e: React.ChangeEvent<HTMLInputElement>) {
    const isListNameExist = createFolderState.createFolderDTO.allListNames.find(
      (listName) => listName === e.target.value
    );
    if (isListNameExist) {
      setError(true);
    } else if (!isListNameExist) {
      setError(false);
    }
    setInput(e.target.value);
  }

  function handleCreateList() {
    if (input && !isListNameExist) {
      setCreateFolderState(
        produce(createFolderState, (draftState) => {
          draftState.createFolderDTO.allListNames.push(input);
        })
      );
      setInput("");
    } else if (isListNameExist) {
      setError(true);
    }
  }

  function handleDeleteList(name: string) {
    setCreateFolderState(
      produce(createFolderState, (draftState) => {
        draftState.createFolderDTO.allListNames =
          draftState.createFolderDTO.allListNames.filter(
            (listName) => listName !== name
          );
      })
    );
  }

  return (
    <CreateFolderTemplate
      isCurrentStepEntry={false}
      createFolderState={createFolderState}
      title="Your tasks live in Lists"
      setCreateFolderState={setCreateFolderState}
    >
      <Box fontWeight="semibold" fontSize="sm" mb="1">
        List name
      </Box>

      <InputGroup>
        <Input
          autoFocus
          value={input}
          variant="flushed"
          onChange={handleInputOnChange}
          placeholder="Enter list name"
          onKeyPress={(e) =>
            (e.key === "Enter" || e.code === "NumpadEnter") &&
            handleCreateList()
          }
        />

        {input && (
          <InputRightElement
            children={
              <Box fontSize="10px" opacity="80%">
                <i className="bi bi-arrow-return-left"></i>
              </Box>
            }
          />
        )}
      </InputGroup>

      {error && (
        <Flex color="red.500" fontSize="13px" mt="2">
          <i className="bi bi-exclamation-triangle-fill"></i>
          <Box ml="1">Whoops! A List already exists with this name.</Box>
        </Flex>
      )}

      <Flex flexWrap="wrap">
        {createFolderState.createFolderDTO.allListNames.map((listName) => (
          <Center
            px="3"
            mr="7px"
            mt="15px"
            rounded="3px"
            height="40px"
            color="white"
            key={listName}
            fontSize="15px"
            width="fit-content"
            fontWeight="semibold"
            bgColor="customBlue.200"
          >
            <Box mr="2">{listName}</Box>
            <Box
              fontSize="15px"
              cursor="pointer"
              onClick={() => handleDeleteList(listName)}
            >
              <i className="bi bi-x-lg"></i>
            </Box>
          </Center>
        ))}
      </Flex>
    </CreateFolderTemplate>
  );
}
