const components = {
  Button: {
    baseStyle: {
      fontWeight: "600",
    },
    sizes: {
      md: {
        px: 6,
        py: 4,
      },
    },
    variants: {
      solid: (props) => ({
        bg: props.colorScheme === "brand" ? "brand.500" : undefined,
        color: "white",
        _hover: { bg: props.colorScheme === "brand" ? "brand.600" : undefined },
      }),
    },
    defaultProps: {
      colorScheme: "brand",
    },
  },
  Card: {
    baseStyle: {
      container: {
        borderRadius: "xl",
        borderWidth: "1px",
        borderColor: "gray.200",
        _dark: {
          borderColor: "whiteAlpha.200",
        },
        boxShadow: "sm",
      },
    },
  },
  Table: {
    variants: {
      simple: {
        th: {
          textTransform: "none",
          fontSize: "sm",
          color: "gray.600",
          _dark: {
            color: "gray.400",
          },
        },
        td: {
          fontSize: "sm",
        },
      },
    },
  },
  Badge: {
    baseStyle: {
      textTransform: "none",
      fontWeight: "600",
    },
  },
};

export default components;
