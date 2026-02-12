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
import { requestSignup } from "../../API/signupRequests.api";

const SignUp = () => {
  const navigate = useNavigate();
  const pageBg = useColorModeValue("gray.100", "slate.900");
  const cardBg = useColorModeValue("white", "slate.800");
  const headingColor = useColorModeValue("gray.700", "white");
  const labelColor = useColorModeValue("gray.700", "gray.200");

  const [formState, setFormState] = useState({
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [touched, setTouched] = useState({
    email: false,
    password: false,
    confirmPassword: false,
  });

  const [status, setStatus] = useState("idle");
  const [errorMessage, setErrorMessage] = useState("");

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormState((prev) => ({ ...prev, [name]: value }));

    if (status !== "idle") {
      setStatus("idle");
      setErrorMessage("");
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    // Mark all fields as touched
    setTouched({ email: true, password: true, confirmPassword: true });

    // Basic validation
    if (!formState.email || !formState.password || !formState.confirmPassword) {
      setStatus("error");
      return;
    }

    if (formState.password.length < 8) {
      setStatus("shortPassword");
      return;
    }

    if (formState.password !== formState.confirmPassword) {
      setStatus("mismatch");
      return;
    }

    // Optional: email format check
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formState.email.trim())) {
      setStatus("invalidEmail");
      return;
    }

    try {
      setStatus("submitting");
      await requestSignup({
        email: formState.email.trim(),
        password: formState.password,
      });
      setStatus("success");

      // Reset form and touched
      setFormState({ email: "", password: "", confirmPassword: "" });
      setTouched({ email: false, password: false, confirmPassword: false });

      // Redirect after short delay
      setTimeout(() => navigate("/"), 800);
    } catch (error) {
      const message =
        error.response?.data?.message ||
        error.response?.data?.error ||
        error.message ||
        "Signup request failed. Please try again.";
      setErrorMessage(message);
      setStatus("error");
    }
  };

  const emailError = touched.email && !formState.email;
  const emailFormatError = touched.email && formState.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formState.email);
  const passwordError = touched.password && !formState.password;
  const confirmPasswordError = touched.confirmPassword && !formState.confirmPassword;
  const passwordMismatch = touched.confirmPassword && formState.password && formState.confirmPassword && formState.password !== formState.confirmPassword;

  const isFormInvalid =
    !formState.email ||
    !formState.password ||
    !formState.confirmPassword ||
    passwordMismatch ||
    emailFormatError;

  return (
    <Box>
      <Center minH="100vh" bg={pageBg} p={4} flexDirection="column">
        <Box>
          <img src={logo} alt="ZB Logo" style={{ width: '100px', height: '100px', margin: "0 auto 20px auto" }} />
          <Heading as="h1" size="2xl" mb={50} color={headingColor}>
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

          <form onSubmit={handleSubmit} aria-label="Signup form" autoComplete="off">
            <Stack spacing={4}>
              <FormControl isInvalid={emailError || emailFormatError} isRequired>
                <FormLabel color={labelColor}>Email</FormLabel>
                <Input
                  name="email"
                  type="email"
                  placeholder="Enter your email"
                  value={formState.email}
                  onChange={handleChange}
                  onBlur={() => setTouched(prev => ({ ...prev, email: true }))}
                  autoComplete="email"
                />
                <FormErrorMessage>
                  {emailError ? "Email is required." : emailFormatError ? "Invalid email format." : ""}
                </FormErrorMessage>
              </FormControl>

              <FormControl isInvalid={passwordError} isRequired>
                <FormLabel>Password</FormLabel>
                <Input
                  name="password"
                  type="password"
                  placeholder="Enter your password"
                  value={formState.password}
                  onChange={handleChange}
                  onBlur={() => setTouched(prev => ({ ...prev, password: true }))}
                  autoComplete="new-password"
                />
                <FormErrorMessage>Password is required.</FormErrorMessage>
              </FormControl>

              <FormControl isInvalid={confirmPasswordError || passwordMismatch} isRequired>
                <FormLabel>Confirm Password</FormLabel>
                <Input
                  name="confirmPassword"
                  type="password"
                  placeholder="Confirm your password"
                  value={formState.confirmPassword}
                  onChange={handleChange}
                  onBlur={() => setTouched(prev => ({ ...prev, confirmPassword: true }))}
                  autoComplete="new-password"
                />
                <FormErrorMessage>
                  {confirmPasswordError
                    ? "Password confirmation is required."
                    : passwordMismatch
                    ? "Passwords do not match."
                    : ""}
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
                <Alert status="error" borderRadius="md" aria-live="polite">
                  <AlertIcon />
                  <AlertDescription>{errorMessage || "Please fill out all fields."}</AlertDescription>
                </Alert>
              )}

              {status === "shortPassword" && (
                <Alert status="error" borderRadius="md" aria-live="polite">
                  <AlertIcon />
                  <AlertDescription>Password must be at least 8 characters long.</AlertDescription>
                </Alert>
              )}

              {status === "mismatch" && (
                <Alert status="error" borderRadius="md" aria-live="polite">
                  <AlertIcon />
                  <AlertDescription>Passwords do not match. Please confirm again.</AlertDescription>
                </Alert>
              )}

              {status === "invalidEmail" && (
                <Alert status="error" borderRadius="md" aria-live="polite">
                  <AlertIcon />
                  <AlertDescription>Invalid email format.</AlertDescription>
                </Alert>
              )}

              {status === "success" && (
                <Alert status="success" borderRadius="md" aria-live="polite">
                  <AlertIcon />
                  <AlertDescription>
                    Request submitted successfully. You will receive an email once your account is approved.
                  </AlertDescription>
                </Alert>
              )}

              <Button
                type="submit"
                size="lg"
                width="full"
                colorScheme="brand"
                isLoading={status === "submitting"}
                loadingText="Sending..."
                isDisabled={isFormInvalid || status === "submitting"}
              >
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
