import { Box } from "@chakra-ui/react";
import { useState } from "react";
import { SetState, StatusColumns } from "../taskTypes";
import AddStatusColumnInput from "./AddStatusColumnInput";

type Props = {
  setState: SetState;
  statusColumns: StatusColumns;
};

export default function AddStatusColumn({ setState, statusColumns }: Props) {
  const [showEdit, setShowEdit] = useState(false);

  return (
    <>
      {showEdit ? (
        <AddStatusColumnInput
          setState={setState}
          setShowEdit={setShowEdit}
          statusColumns={statusColumns}
        />
      ) : (
        <Box
          p={3}
          height="48px"
          opacity={showEdit ? "" : "70%"}
          borderTop="2px"
          minWidth="280px"
          cursor="pointer"
          // boxShadow="base"
          borderTopRadius="sm"
          _hover={{ boxShadow: "base" }}
          onClick={() => {
            setShowEdit(true);
          }}
        >
          <Box>+ ADD STATUS</Box>
        </Box>
      )}
    </>
  );
}
