import React, { useState } from "react";
import {
  Alert,
  AlertDescription,
  AlertIcon,
  Box,
  Button,
  Center,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Heading,
  Input,
  Stack,
  Text,
  useColorModeValue,
} from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import logo from "../../Assets/logo.png";

const ForgotPassword = () => {
  const navigate = useNavigate();
  const pageBg = useColorModeValue("gray.100", "slate.900");
  const cardBg = useColorModeValue("white", "slate.800");
  const headingColor = useColorModeValue("gray.700", "white");
  const labelColor = useColorModeValue("gray.700", "gray.200");

  const [email, setEmail] = useState("");
  const [touched, setTouched] = useState(false);
  const [status, setStatus] = useState("idle");

  const handleSubmit = (event) => {
    event.preventDefault();
    setTouched(true);
    if (!email) {
      setStatus("error");
      return;
    }
    setStatus("success");
    setTimeout(() => navigate("/"), 1200);
  };

  const emailError = touched && !email;

  return (
    <Box>
      <Center minH="100vh" bg={pageBg} p={4} flexDirection="column">
        <Box>
          <img
            src={logo}
            alt="ZB Logo"
            style={{ width: "100px", height: "100px", margin: "0 auto 20px auto" }}
          />
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
            Forgot Password
          </Heading>
          <form onSubmit={handleSubmit} aria-label="Forgot password form">
            <Stack spacing={4}>
              <FormControl isInvalid={emailError} isRequired>
                <FormLabel color={labelColor}>Email</FormLabel>
                <Input
                  name="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(event) => {
                    setEmail(event.target.value);
                    if (status !== "idle") setStatus("idle");
                  }}
                  onBlur={() => setTouched(true)}
                  autoComplete="email"
                />
                <FormErrorMessage>Email is required.</FormErrorMessage>
              </FormControl>
              {status === "error" && (
                <Alert status="error" borderRadius="md">
                  <AlertIcon />
                  <AlertDescription>Please enter your email to continue.</AlertDescription>
                </Alert>
              )}
              {status === "success" && (
                <Alert status="success" borderRadius="md">
                  <AlertIcon />
                  <AlertDescription>
                    Reset link sent (mocked). Check your email.
                  </AlertDescription>
                </Alert>
              )}
              <Button type="submit" size="lg" width="full" colorScheme="brand">
                Send Reset Link
              </Button>
              <Text fontSize="sm" color={labelColor} textAlign="center">
                Remembered your password?{" "}
                <Text
                  as="span"
                  color="blue.500"
                  fontWeight="600"
                  cursor="pointer"
                  onClick={() => navigate("/")}
                >
                  Back to login
                </Text>
              </Text>
            </Stack>
          </form>
        </Box>
      </Center>
    </Box>
  );
};

export default ForgotPassword;
