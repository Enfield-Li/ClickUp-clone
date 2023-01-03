type handleInputKeyPressParam = {
  value: string;
  e: React.KeyboardEvent<HTMLInputElement>;
  handleOnEnter: () => any;
  handleOnEsc: () => any;
};

export function handleInputKeyPress({
  e,
  value,
  handleOnEnter,
  handleOnEsc,
}: handleInputKeyPressParam) {
  e.stopPropagation();
  if ((e.key === "Enter" || e.code === "NumpadEnter") && value) {
    handleOnEnter();
  } else if (e.key === "Escape") {
    handleOnEsc();
  }
}
