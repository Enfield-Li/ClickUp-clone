import { Flex, Box } from "@chakra-ui/react";

type Props = {
  optionName: string;
  backgroundColor: string;
  children: React.ReactNode;
};

export default function SelectOption({
  optionName,
  children: icon,
  backgroundColor,
}: Props) {
  return (
    <Box my="1" rounded="sm" cursor="pointer" _hover={{ backgroundColor }}>
      <Flex alignItems="center">
        {/* Icon */}
        <Box ml="2" mr="3">
          {icon}
        </Box>

        {/* Option name */}
        <Box>{optionName}</Box>
      </Flex>
    </Box>
  );
}
