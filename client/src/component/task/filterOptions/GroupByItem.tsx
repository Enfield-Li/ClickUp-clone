import { Box, useColorModeValue, Flex, Center } from "@chakra-ui/react";
import React from "react";
import { GroupBy } from "../../../types";

type Props = {
  title: GroupBy;
  onClose: () => void;
  currentSortBy: GroupBy;
  children: React.ReactNode;
  setSortBy: React.Dispatch<React.SetStateAction<GroupBy>>;
};

export default function GroupByItem({
  title,
  onClose,
  children,
  setSortBy,
  currentSortBy,
}: Props) {
  const popoverContentHoverBgColor = useColorModeValue(
    "lightMain.100",
    "darkMain.200"
  );

  function handleSelectSortBy() {
    onClose();
    setSortBy(title);
  }

  return (
    <Flex
      px="2"
      py="4"
      rounded="md"
      height="30px"
      cursor="pointer"
      fontSize="small"
      alignItems="center"
      fontWeight="semibold"
      onClick={handleSelectSortBy}
      justifyContent="space-between"
      _hover={{ bg: popoverContentHoverBgColor }}
    >
      <Flex>
        <Center opacity="60%" mr="2">
          {children}
        </Center>
        <Center mb="2px">{title}</Center>
      </Flex>

      {currentSortBy === title && (
        <Box fontSize="25px" color="purple.400" mb="2px">
          <i className="bi bi-check"></i>
        </Box>
      )}
    </Flex>
  );
}
