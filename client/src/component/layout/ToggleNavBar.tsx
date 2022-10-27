import { motion } from "framer-motion";
import { useState } from "react";
import NavBar from "./NavBar";

type Props = {
  isOpen: boolean;
  onToggle: () => void;
  getDisclosureProps: (props?: any) => any;
};

export default function ToggleNavBar({
  isOpen,
  onToggle,
  getDisclosureProps,
}: Props) {
  const [hidden, setHidden] = useState(!isOpen);

  return (
    // https://chakra-ui.com/community/recipes/horizontal-collapse
    <motion.div
      transition={"none"}
      {...getDisclosureProps()}
      hidden={hidden}
      initial={false}
      onAnimationStart={() => setHidden(false)}
      onAnimationComplete={() => setHidden(!isOpen)}
      animate={{ width: isOpen ? 220 : 0 }}
      style={{
        overflow: "hidden",
        whiteSpace: "nowrap",
      }}
    >
      <NavBar onToggle={onToggle} />
    </motion.div>
  );
}
