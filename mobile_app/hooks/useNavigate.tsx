import { useNavigation } from "expo-router";
import React from "react";

export default function useNavigate() {
  return useNavigation().navigate;
}
