import { Box, Divider, Flex } from "@chakra-ui/react";
import { PriorityColumns } from "../Data";

type Props = {
  onClose: () => void;
  priorityColumns: PriorityColumns;
};

export default function PriorityOptions({ priorityColumns, onClose }: Props) {
  return (
    <>
      {priorityColumns.map(
        (priority) =>
          priority.id !== 0 && (
            <>
              <Flex
                p={3}
                rounded="sm"
                cursor="pointer"
                key={priority.id}
                onClick={() => {
                  onClose();
                }}
                _hover={{ backgroundColor: "blue.600" }}
              >
                <Box color={priority.color} mr={4}>
                  <i className="bi bi-flag-fill"></i>
                </Box>
                {priority.title}
              </Flex>

              {/* Last row */}
              {priority.id !== 5 && <Divider />}
            </>
          )
      )}
    </>
  );
}
