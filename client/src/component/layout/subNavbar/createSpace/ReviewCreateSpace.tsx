import { Flex } from "@chakra-ui/react";
import { memo } from "react";
import { CreateSpace } from "../../../../types";

type Props = {
  createSpace: CreateSpace;
  setCreateSpace: React.Dispatch<React.SetStateAction<CreateSpace>>;
};

export default memo(ReviewCreateSpace);
function ReviewCreateSpace({ createSpace, setCreateSpace }: Props) {
  return (
    <Flex pt="6" height="100%" alignItems="center">
      content
    </Flex>
  );
}
