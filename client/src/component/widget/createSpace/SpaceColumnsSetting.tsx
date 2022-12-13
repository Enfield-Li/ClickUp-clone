import { Flex } from "@chakra-ui/react";
import { memo } from "react";
import { CreateSpace } from "../../../types";
import StatusColumnsDisplay from "../statusColumn/StatusColumnsDisplay";

type Props = {
  //   createSpace: CreateSpace;
  setCreateSpace: React.Dispatch<React.SetStateAction<CreateSpace>>;
};

export default memo(SpaceColumnsSetting);
function SpaceColumnsSetting({ setCreateSpace }: Props) {
  return (
    <Flex pt="6" height="100%" alignItems="center">
      <StatusColumnsDisplay setCreateSpace={setCreateSpace} />
    </Flex>
  );
}
