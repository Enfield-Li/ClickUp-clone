import React, { useEffect } from "react";

export default function useInit() {
  useEffect(() => {
    console.log("Initialize some network connection...");
  }, []);
}
