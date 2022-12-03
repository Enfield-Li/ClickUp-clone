import { Flex } from "@chakra-ui/react";
import { memo } from "react";
import StatusColumnsDisplay from "../../../customStatusColumn/StatusColumnsDisplay";

type Props = {
  //   createSpace: CreateSpace;
  //   setCreateSpace: React.Dispatch<React.SetStateAction<CreateSpace>>;
};

export default memo(SpaceColumnsSetting);
function SpaceColumnsSetting({}: Props) {
  return (
    <Flex pt="6" height="100%" alignItems="center">
      <StatusColumnsDisplay />
    </Flex>
  );
}
