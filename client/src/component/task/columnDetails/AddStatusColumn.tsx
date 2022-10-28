import { Box, Center } from "@chakra-ui/react";
import { useState } from "react";
import { SetState, StatusColumns } from "../taskTypes";
import AddStatusColumnInput from "./AddStatusColumnInput";
import { HexColorPicker } from "react-colorful";

type Props = {
  setState: SetState;
  statusColumns: StatusColumns;
};

export default function AddStatusColumn({ setState, statusColumns }: Props) {
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
            <Center mt={3} flexDirection="column">
              {/* <Box>Pick a color for new column:</Box> */}
              <HexColorPicker color={color} onChange={setColor} />
            </Center>
          )}
        </>
      ) : (
        <>
          <Center
            p={3}
            height="48px"
            borderTop="2px"
            minWidth="280px"
            cursor="pointer"
            borderTopRadius="sm"
            _hover={{ boxShadow: "base" }}
            opacity={showEdit ? "" : "70%"}
            onClick={() => {
              setShowEdit(true);
            }}
          >
            <Box>+ ADD STATUS</Box>
          </Center>
        </>
      )}
    </>
  );
}
