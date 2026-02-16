import React, { useState } from "react";
import {
  Alert,
  AlertDescription,
  AlertIcon,
  Button,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input,
  Box,
  Center,
  Heading,
  Stack,
  Text,
  useColorModeValue
} from "@chakra-ui/react";
import logo from '../../Assets/logo.png';
import { useNavigate } from "react-router-dom";
import { users } from "../../data/users";
import { useAppContext } from "../../context/AppContext";
import { login } from "../../API/auth.api";


const LoginForm = () => {
  const navigate = useNavigate();
  const { setUser } = useAppContext();
  const pageBg = useColorModeValue("gray.100", "slate.900");
  const cardBg = useColorModeValue("white", "slate.800");
  const headingColor = useColorModeValue("gray.700", "white");
  const labelColor = useColorModeValue("gray.700", "gray.200");
  const [formState, setFormState] = useState({
    username: "",
    password: "",
  });
  const [touched, setTouched] = useState({ username: false, password: false });
  const [status, setStatus] = useState("idle");

  const parseJwtPayload = (token) => {
    if (!token || typeof token !== "string") return null;
    const parts = token.split(".");
    if (parts.length !== 3) return null;
    try {
      const base64 = parts[1].replace(/-/g, "+").replace(/_/g, "/");
      const padded = base64.padEnd(base64.length + (4 - (base64.length % 4)) % 4, "=");
      const json = atob(padded);
      return JSON.parse(json);
    } catch (error) {
      return null;
    }
  };

  const resolveUserRole = (data) => {
    const directRole = data?.role || data?.user?.role;
    if (directRole) return directRole;

    const roleFromArrays =
      data?.roles?.[0] ||
      data?.authorities?.[0] ||
      data?.user?.roles?.[0] ||
      data?.user?.authorities?.[0];
    if (roleFromArrays) return roleFromArrays;

    const payload = parseJwtPayload(data?.accessToken);
    const tokenRoles =
      payload?.roles ||
      payload?.authorities ||
      payload?.role ||
      payload?.scope;
    if (Array.isArray(tokenRoles) && tokenRoles.length) return tokenRoles[0];
    if (typeof tokenRoles === "string") return tokenRoles.split(" ")[0];

    return "USER";
  };

  const handleChange = (event) => {
    setFormState((prev) => ({ ...prev, [event.target.name]: event.target.value }));
    if (status !== "idle") {
      setStatus("idle");
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setTouched({ username: true, password: true });

    if (!formState.username || !formState.password) {
      setStatus("error");
      return;
    }

    try {
      const res = await login({
        email: formState.username,
        password: formState.password,
      });

      localStorage.setItem("token", res.data.accessToken);

      const fallbackEmail = res.data.user?.email || formState.username;
      const adminEmails = new Set(["admin@zb.com", "admin@com"]);
      const emailLocalPart = fallbackEmail?.split("@")?.[0] || fallbackEmail;
      const resolvedRole = resolveUserRole(res.data);
      const role =
        resolvedRole !== "USER"
          ? resolvedRole
          : adminEmails.has(fallbackEmail?.toLowerCase())
            ? "ADMIN"
            : "USER";

      setUser({
        id: res.data.user?.id,
        name: emailLocalPart,
        role,
        department: "Case Operations",
        email: res.data.user?.email || fallbackEmail,
      });

      setStatus("success");
      setTimeout(() => navigate("/dashboard"), 500);
    } catch (err) {
      if (err.response?.status === 401) {
        setStatus("invalid");
      } else {
        setStatus("error");
      }
    }
  };

  const usernameError = touched.username && !formState.username;
  const passwordError = touched.password && !formState.password;

  return (
    <Box>
        <Center minH="100vh" bg={pageBg} p={4} flexDirection="column" >
            <Box>
                <img src={logo} alt="ZB Logo" style={{ width: '100px', height: '100px', margin: "0 auto 20px auto" }} />
                <Heading as="h1" size="2xl" mb={50} color={headingColor} >
                   ZB Support Hub
                </Heading>
            </Box>
            <Box
            maxW="md"
            w="full"
            bg={cardBg}
            p={8}
            borderRadius="lg"
            boxShadow="lg"
            >
            <Heading as="h2" size="lg" textAlign="center" mb={6} color={headingColor}>
                Login
            </Heading>
            <form onSubmit={handleSubmit} aria-label="Login form" autoComplete="off">
      <Stack spacing={4}>
        <FormControl isInvalid={usernameError} isRequired>
          <FormLabel color={labelColor}>Username</FormLabel>
          <Input
            name="username"
            placeholder="Enter your username"
            value={formState.username}
            onChange={handleChange}
            onBlur={() => setTouched((prev) => ({ ...prev, username: true }))}
            autoComplete="off"
          />
          <FormErrorMessage>Username is required.</FormErrorMessage>
        </FormControl>
        <FormControl isInvalid={passwordError} isRequired>
          <FormLabel>Password</FormLabel>
          <Input
            name="password"
            type="password"
            placeholder="Enter your password"
            value={formState.password}
            onChange={handleChange}
            onBlur={() => setTouched((prev) => ({ ...prev, password: true }))}
            autoComplete="new-password"
          />
          <FormErrorMessage>Password is required.</FormErrorMessage>
        </FormControl>
        <Text fontSize="sm" color={labelColor} textAlign="center">
          Don&#39;t have an account?{" "}
          <Text as="span" color="blue.500" fontWeight="600" cursor="pointer" onClick={() => navigate("/signup")}>
            Sign up
          </Text>
        </Text>
        {status === "error" && (
          <Alert status="error" borderRadius="md">
            <AlertIcon />
            <AlertDescription>
              Please enter your username and password to continue.
            </AlertDescription>
          </Alert>
        )}
        {status === "invalid" && (
          <Alert status="error" borderRadius="md">
            <AlertIcon />
            <AlertDescription>
              Invalid credentials. Check your username and password.
            </AlertDescription>
          </Alert>
        )}
        {status === "success" && (
          <Alert status="success" borderRadius="md">
            <AlertIcon />
            <AlertDescription>
              Login validated. Proceed to your dashboard.
            </AlertDescription>
          </Alert>
        )}
        <Button type="submit" size="lg" width="full" colorScheme="brand">
          Sign in
        </Button>
         <Text
          fontSize="sm"
          color={labelColor}
          textAlign="center"
          cursor="pointer"
          onClick={() => navigate("/forgot-password")}
          onPointerEnter={(e) => e.target.style.textDecoration = "underline"}
          onPointerLeave={(e) => e.target.style.textDecoration = "none"}
        >
          Forgot password?
        </Text>
      </Stack>
    </form>
            </Box>
        </Center>
    </Box>
  );
};

export default LoginForm;
