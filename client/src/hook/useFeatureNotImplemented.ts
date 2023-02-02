import { useToast } from "@chakra-ui/react";
import React from "react";

export default function useUnImplementedToast() {
  return useToast({
    status: "info",
    title: "Nope",
    description: "I haven't implemented this feature yet...",
  });
}
