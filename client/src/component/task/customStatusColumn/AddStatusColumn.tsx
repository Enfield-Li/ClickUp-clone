import { Box, Center, Flex, useColorModeValue } from "@chakra-ui/react";
import { memo, useState } from "react";
import { SetState, StatusColumns } from "../../../types";
import AddStatusColumnInput from "./AddStatusColumnInput";
import { HexColorPicker } from "react-colorful";

type Props = {
  setState: SetState;
  statusColumns: StatusColumns;
};

function AddStatusColumn({ setState, statusColumns }: Props) {
  const hoverBgColor = useColorModeValue("white", "darkMain.200");

  const [showEdit, setShowEdit] = useState(false);
  const [color, setColor] = useState("#aabbcc");

  return (
    <>
      {showEdit ? (
        <>
          <Box>
            <AddStatusColumnInput
              color={color}
              setState={setState}
              setShowEdit={setShowEdit}
              statusColumns={statusColumns}
            />
          </Box>

          {showEdit && (
            <Center mt={3}>
              <Box shadow="2xl" width="fit-content">
                <HexColorPicker color={color} onChange={setColor} />
              </Box>
            </Center>
          )}
        </>
      ) : (
        <>
          <Center
            p={3}
            height="48px"
            borderTop="2px"
            fontSize="13px"
            minWidth="250px"
            cursor="pointer"
            borderTopRadius="sm"
            opacity={showEdit ? undefined : "70%"}
            onClick={() => setShowEdit(true)}
            _hover={{ boxShadow: "base", bgColor: hoverBgColor }}
          >
            <Box>+ ADD STATUS</Box>
          </Center>
        </>
      )}
    </>
  );
}
export default memo(AddStatusColumn);
