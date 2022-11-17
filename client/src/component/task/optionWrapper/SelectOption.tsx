import { Flex, Box } from "@chakra-ui/react";
import { memo } from "react";

type Props = {
  optionName: string;
  onClose: () => void;
  hoverBgColor: string;
  children: React.ReactNode;
  setEditTitle?: React.Dispatch<React.SetStateAction<boolean>>;
};

export default memo(function OptionWrapper({
  onClose,
  optionName,
  setEditTitle,
  hoverBgColor,
  children: icon,
}: Props) {
  return (
    <Box
      py={1}
      my={1}
      rounded="md"
      cursor="pointer"
      _hover={{ bgColor: hoverBgColor }}
      onClick={() => {
        onClose();
        if (setEditTitle) setEditTitle(true);
      }}
    >
      <Flex alignItems="center">
        {/* Icon */}
        <Box ml="2" mr="3" fontSize="12px">
          {icon}
        </Box>

        {/* Option name */}
        <Box fontSize="smaller" fontWeight="bold">
          {optionName}
        </Box>
      </Flex>
    </Box>
  );
});
