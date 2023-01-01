import {
  Box,
  InputGroup,
  Input,
  InputRightAddon,
  Button,
  InputLeftElement,
  InputRightElement,
  Center,
  Flex,
  useColorModeValue,
  Tooltip,
} from "@chakra-ui/react";
import React, { useState } from "react";
import { CreateFolderState, CreateFolderStep } from "../../../types";
import CreateFolderTemplate from "./CreateFolderTemplate";
// import logo from "../../media/clickup_logo.png";
import shareLink from "../../../media/share-link.png";

type Props = {
  createFolder: CreateFolderState;
  setCreateFolder: React.Dispatch<React.SetStateAction<CreateFolderState>>;
};

export default function CreateFolderSetPrivacy({
  createFolder,
  setCreateFolder,
}: Props) {
  const [input, setInput] = useState("");
  const [isAddingUser, setIsAddingUser] = useState(false);
  const interactColor = useColorModeValue("lightMain.200", "darkMain.200");

  function handleInputOnChange(e: React.ChangeEvent<HTMLInputElement>) {
    setInput(e.target.value);
  }

  return (
    <CreateFolderTemplate
      createFolder={createFolder}
      title="Who is this Folder for?"
      setCreateFolder={setCreateFolder}
      currentStep={CreateFolderStep.ENTRY}
    >
      <InputGroup onClick={() => setIsAddingUser(true)} fontWeight="semibold">
        {isAddingUser && (
          <InputLeftElement
            pointerEvents="none"
            children={
              <Box opacity="40%" fontSize="13px">
                <i className="bi bi-search"></i>
              </Box>
            }
          />
        )}

        <Input
          autoFocus
          value={input}
          onChange={handleInputOnChange}
          placeholder="Invite by name or email"
          variant={isAddingUser ? undefined : ""}
        />

        {!isAddingUser ? (
          <InputRightAddon
            p="0"
            children={
              <Button
                _focus={{}}
                _active={{}}
                width="100%"
                type="submit"
                color="white"
                borderLeftRadius="0"
                bgColor="customBlue.200"
                _hover={{ bgColor: "customBlue.100" }}
              >
                Invite
              </Button>
            }
          />
        ) : (
          <InputRightElement
            cursor="pointer"
            children={
              <Center
                width="15px"
                height="15px"
                rounded="full"
                color="lightMain.200"
                fontWeight="extrabold"
                bgColor="customBlue.200"
                _hover={{ bgColor: "customBlue.100" }}
                onClick={(e) => {
                  e.stopPropagation();
                  setIsAddingUser(false);
                }}
              >
                <i className="bi bi-x"></i>
              </Center>
            }
          />
        )}
      </InputGroup>

      {!isAddingUser ? (
        <Box mt="5" fontWeight="semibold">
          <Flex alignItems="center" justifyContent="space-between">
            <Tooltip
              label={
                <Box>
                  <img src={shareLink} />
                  <Box fontWeight="semibold" fontSize="13px" mt="1">
                    Only those with permissions can access with this link.
                  </Box>
                </Box>
              }
              aria-label="A tooltip"
            >
              <Flex alignItems="center">
                <Box fontSize="16px">
                  <i className="bi bi-link-45deg"></i>
                </Box>
                <Box mx="2" fontSize="15px">
                  Private link
                </Box>
                <Box opacity="50%" fontSize="10px" mt="2px">
                  <i className="bi bi-info-circle-fill"></i>
                </Box>
              </Flex>
            </Tooltip>

            <Box
              px="5px"
              py="3px"
              rounded="3px"
              fontSize="12px"
              borderWidth="1px"
              cursor="not-allowed"
              borderColor={interactColor}
              _hover={{ bgColor: interactColor }}
            >
              Copy link
            </Box>
          </Flex>

          <Box opacity="45%" fontSize="12px" mt="4">
            SHARE WITH
          </Box>
          <Box></Box>
        </Box>
      ) : (
        <Box>
          <Box>All members</Box>
          <Box></Box>
        </Box>
      )}
    </CreateFolderTemplate>
  );
}