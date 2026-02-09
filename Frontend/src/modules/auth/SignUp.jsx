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

const SignUp = () => {
  const navigate = useNavigate();
  const pageBg = useColorModeValue("gray.100", "slate.900");
  const cardBg = useColorModeValue("white", "slate.800");
  const headingColor = useColorModeValue("gray.700", "white");
  const labelColor = useColorModeValue("gray.700", "gray.200");
  const [formState, setFormState] = useState({
    username: "",
    password: "",
    confirmPassword: "",
  });
  const [touched, setTouched] = useState({
    username: false,
    password: false,
    confirmPassword: false,
  });
  const [status, setStatus] = useState("idle");

  const handleChange = (event) => {
    setFormState((prev) => ({ ...prev, [event.target.name]: event.target.value }));
    if (status !== "idle") {
      setStatus("idle");
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    setTouched({ username: true, password: true, confirmPassword: true });
    if (!formState.username || !formState.password || !formState.confirmPassword) {
      setStatus("error");
      return;
    } 
    if (formState.password !== formState.confirmPassword) {
      setStatus("mismatch");
      return;
    }
    setStatus("success");
    setTimeout(() => navigate("/"), 800);
    setFormState({ username: "", password: "", confirmPassword: "" });
  };

  const usernameError = touched.username && !formState.username;
  const passwordError = touched.password && !formState.password;
  const confirmPasswordError =
    touched.confirmPassword && !formState.confirmPassword;
  const passwordMismatch =
    touched.confirmPassword &&
    formState.confirmPassword &&
    formState.password !== formState.confirmPassword;

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
                Sign Up Request
            </Heading>
            <form onSubmit={handleSubmit} aria-label="Login form">
      <Stack spacing={4}>
        <FormControl isInvalid={usernameError} isRequired>
          <FormLabel color={labelColor}>Email</FormLabel>
          <Input
            name="username"
            placeholder="Enter your email"
            value={formState.username}
            onChange={handleChange}
            onBlur={() => setTouched((prev) => ({ ...prev, username: true }))}
            autoComplete="username"
          />
          <FormErrorMessage>Email is required.</FormErrorMessage>
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
            autoComplete="current-password"
          />
          <FormErrorMessage>Password is required.</FormErrorMessage>
        </FormControl>
        <FormControl isInvalid={confirmPasswordError || passwordMismatch} isRequired>
          <FormLabel>Confirm Password</FormLabel>
          <Input
            name="confirmPassword"
            type="password"
            placeholder="Confirm your password"
            value={formState.confirmPassword || ""}
            onChange={handleChange}
            onBlur={() => setTouched((prev) => ({ ...prev, confirmPassword: true }))}
            autoComplete="current-password"
          />
          <FormErrorMessage>
            {confirmPasswordError
              ? "Password confirmation is required."
              : "Passwords do not match."}
          </FormErrorMessage>
        </FormControl>

        <Text fontSize="sm" color={labelColor} textAlign="center">
          Already have an account?{" "}
          <Text
            as="span"
            color="blue.500"
            fontWeight="600"
            cursor="pointer"
            onClick={() => navigate("/")}
          >
            Login
          </Text>
        </Text>
        {status === "error" && (
          <Alert status="error" borderRadius="md">
            <AlertIcon />
            <AlertDescription>
              Please enter your email, password and confirm password to continue.
            </AlertDescription>
          </Alert>
        )}
        {status === "mismatch" && (
          <Alert status="error" borderRadius="md">
            <AlertIcon />
            <AlertDescription>
              Passwords do not match. Please confirm again.
            </AlertDescription>
          </Alert>
        )}
        {status === "success" && (
          <Alert status="success" borderRadius="md">
            <AlertIcon />
            <AlertDescription>
              Request submitted successfully. You will receive an email once your account is approved.
            </AlertDescription>
          </Alert>
        )}
        <Button type="submit" size="lg" width="full" colorScheme="brand">
          Send Request
        </Button>
      </Stack>
    </form>
            </Box>
        </Center>
    </Box>
  );
};

export default SignUp;
