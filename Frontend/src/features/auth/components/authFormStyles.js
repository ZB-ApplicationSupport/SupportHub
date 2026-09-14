export const AUTH_LABEL_PROPS = {
  fontSize: "11px",
  fontWeight: "600",
  letterSpacing: "0.06em",
  textTransform: "uppercase",
  color: "text.muted",
  mb: 2,
  requiredIndicator: null,
};

export const AUTH_INPUT_PROPS = {
  h: "48px",
  borderRadius: "12px",
  bg: "surface.input",
  borderColor: "border.default",
  color: "text.primary",
  fontSize: "14px",
  fontWeight: "500",
  _placeholder: { color: "text.muted" },
  _hover: { borderColor: "brand.200" },
  _focus: {
    borderColor: "brand.300",
    boxShadow: "0 0 0 3px rgba(20, 143, 65, 0.16)",
  },
};

export const AUTH_BUTTON_PROPS = {
  h: "48px",
  borderRadius: "12px",
  bg: "#00843D",
  color: "white",
  fontSize: "15px",
  fontWeight: "700",
  _hover: { bg: "#006B32" },
  _active: { bg: "#0C5F2C" },
};

export const AUTH_LINK_PROPS = {
  color: "text.brand",
  fontWeight: "600",
  cursor: "pointer",
  _hover: { textDecoration: "underline" },
};
