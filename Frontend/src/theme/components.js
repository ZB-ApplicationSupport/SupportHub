const greenFocus = {
  borderColor: "brand.300",
  boxShadow: "0 0 0 3px rgba(20, 143, 65, 0.16)",
};

const components = {
  Button: {
    baseStyle: {
      fontWeight: "700",
      borderRadius: "12px",
    },
    sizes: {
      sm: {
        h: "36px",
        px: 4,
        fontSize: "13px",
      },
      md: {
        h: "44px",
        px: 6,
        fontSize: "14px",
      },
    },
    variants: {
      solid: (props) => ({
        bg: props.colorScheme === "brand" ? "brand.500" : undefined,
        color: "white",
        boxShadow: "none",
        _hover: {
          bg: props.colorScheme === "brand" ? "brand.600" : undefined,
        },
        _active: {
          bg: props.colorScheme === "brand" ? "brand.700" : undefined,
        },
      }),
      outline: {
        borderWidth: "1px",
        borderColor: "border.default",
        color: "text.primary",
        bg: "surface.input",
        _hover: {
          bg: "surface.subtle",
          borderColor: "brand.200",
        },
      },
      ghost: {
        _hover: {
          bg: "brand.wash",
          color: "brand.onWash",
        },
      },
    },
    defaultProps: {
      colorScheme: "brand",
    },
  },
  Input: {
    variants: {
      outline: {
        field: {
          bg: "surface.input",
          border: "1px solid",
          borderColor: "border.default",
          borderRadius: "12px",
          boxShadow: "none",
          fontSize: "14px",
          fontWeight: "500",
          _placeholder: {
            color: "text.muted",
          },
          _hover: {
            borderColor: "brand.200",
          },
          _focus: greenFocus,
          _focusVisible: greenFocus,
        },
      },
    },
    defaultProps: {
      variant: "outline",
    },
  },
  Select: {
    baseStyle: {
      field: {
        bg: "surface.input",
        border: "1px solid",
        borderColor: "border.default",
        borderRadius: "12px",
        boxShadow: "none",
        color: "text.primary",
        fontSize: "14px",
        fontWeight: "500",
        minH: "48px",
        px: 4,
        cursor: "pointer",
        transition: "all 0.2s ease",
        _hover: {
          borderColor: "brand.200",
        },
        _focus: greenFocus,
        _focusVisible: greenFocus,
        "& option": {
          bg: "surface.card",
          color: "#1A202C",
          fontSize: "15px",
          fontWeight: "500",
          minH: "48px",
          py: 3,
        },
        "& option:checked": {
          bg: "#E7F5ED",
          color: "#1A202C",
        },
      },
      icon: {
        color: "text.muted",
        right: 4,
      },
    },
  },
  Textarea: {
    variants: {
      outline: {
        bg: "surface.input",
        border: "1px solid",
        borderColor: "border.default",
        borderRadius: "12px",
        _hover: {
          borderColor: "brand.200",
        },
        _focus: greenFocus,
        _focusVisible: greenFocus,
      },
    },
  },
  Popover: {
    baseStyle: {
      content: {
        bg: "surface.card",
        border: "1px solid",
        borderColor: "border.default",
        borderRadius: "16px",
        boxShadow: "cardHover",
      },
      header: {
        bg: "surface.card",
      },
      body: {
        bg: "surface.card",
      },
    },
  },
  Menu: {
    baseStyle: {
      list: {
        bg: "surface.card",
        border: "1px solid",
        borderColor: "border.default",
        borderRadius: "16px",
        boxShadow: "cardHover",
        overflow: "hidden",
        py: 1,
      },
      item: {
        borderRadius: "10px",
        mx: 1,
        color: "text.primary",
        _hover: {
          bg: "brand.wash",
        },
        _focus: {
          bg: "brand.wash",
        },
      },
    },
  },
  Modal: {
    baseStyle: {
      overlay: {
        bg: "blackAlpha.600",
      },
      dialog: {
        bg: "white",
        borderRadius: "20px",
        boxShadow: "0 24px 64px rgba(15, 23, 42, 0.22)",
        _dark: {
          bg: "#1A211D",
        },
      },
      header: {
        bg: "white",
        _dark: {
          bg: "#1A211D",
        },
      },
      body: {
        bg: "white",
        _dark: {
          bg: "#1A211D",
        },
      },
      footer: {
        bg: "white",
        _dark: {
          bg: "#1A211D",
        },
      },
    },
  },
  Alert: {
    baseStyle: {
      container: {
        borderRadius: "16px",
      },
    },
  },
  Card: {
    baseStyle: {
      container: {
        borderRadius: "20px",
        borderWidth: "1px",
        borderColor: "border.default",
        boxShadow: "card",
      },
    },
  },
  Table: {
    variants: {
      simple: {
        th: {
          textTransform: "none",
          fontSize: "xs",
          fontWeight: "600",
          letterSpacing: "0.05em",
          color: "text.muted",
          bg: "surface.card",
          borderColor: "border.default",
        },
        td: {
          fontSize: "sm",
          fontWeight: "400",
          color: "text.primary",
          borderColor: "border.default",
        },
      },
    },
  },
  Badge: {
    baseStyle: {
      textTransform: "none",
      fontWeight: "600",
      borderRadius: "8px",
    },
  },
  Heading: {
    baseStyle: {
      color: "text.primary",
      letterSpacing: "-0.03em",
    },
  },
};

export default components;
