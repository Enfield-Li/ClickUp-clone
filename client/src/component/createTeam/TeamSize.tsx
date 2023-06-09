import { Center, Flex, useColorModeValue } from "@chakra-ui/react";
import { useState } from "react";
import { CreateTeamDTO } from "./CreateTeam";

type Props = {
  step: number;
  handleNextStage(stage: number): void;
  setTeam: React.Dispatch<React.SetStateAction<CreateTeamDTO>>;
};

type SizeState = {
  selectedSize: string;
  sizes: string[];
};
const initSizes = [
  "Just me",
  "2-5",
  "6-10",
  "11-25",
  "26-50",
  "51-200",
  "201-500",
  "500+",
];

export default function TeamSize({ step, handleNextStage, setTeam }: Props) {
  const color = useColorModeValue("gray.500", "gray.300");

  const [sizeState, setSizeState] = useState<SizeState>({
    selectedSize: "",
    sizes: initSizes,
  });

  function handleSelect(size: string) {
    setSizeState({ ...sizeState, selectedSize: size });
    handleNextStage(3);
  }

  return (
    <>
      <Flex pt="3">
        {sizeState.sizes.map((size, index) => (
          <Center
            mr="2"
            px="20px"
            key={index}
            rounded="md"
            height="40px"
            cursor="pointer"
            borderWidth="1px"
            fontWeight="semibold"
            _hover={{ borderColor: "customBlue.200" }}
            onClick={() => handleSelect(size)}
            color={sizeState.selectedSize === size ? "purple.500" : color}
            borderColor={
              sizeState.selectedSize === size ? "purple.500" : "gray.300"
            }
          >
            {size}
          </Center>
        ))}
      </Flex>

      <Center
        mt="2"
        mr="2"
        px="20px"
        rounded="md"
        height="40px"
        cursor="pointer"
        borderWidth="1px"
        width="fit-content"
        fontWeight="semibold"
        _hover={{ borderColor: "customBlue.200" }}
        onClick={() => handleSelect("I don't know")}
        color={sizeState.selectedSize === "I don't know" ? "purple.500" : color}
        borderColor={
          sizeState.selectedSize === "I don't know" ? "purple.500" : "gray.300"
        }
      >
        I don't know
      </Center>
    </>
  );
}
