import React, { useState, useEffect } from "react";
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
import { useNavigate, useSearchParams } from "react-router-dom";
import logo from "../../Assets/logo.png";
import { resetPassword as resetPasswordApi } from "../../API/forgotPassword.api";

const ResetPassword = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");

  const pageBg = useColorModeValue("gray.100", "slate.900");
  const cardBg = useColorModeValue("white", "slate.800");
  const headingColor = useColorModeValue("gray.700", "white");
  const labelColor = useColorModeValue("gray.700", "gray.200");

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [touched, setTouched] = useState(false);
  const [status, setStatus] = useState("idle");
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    if (!token) {
      setStatus("invalid_token");
    }
  }, [token]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setTouched(true);

    if (!newPassword) {
      setStatus("error");
      setErrorMessage("Please enter a new password.");
      return;
    }
    if (newPassword !== confirmPassword) {
      setStatus("error");
      setErrorMessage("Passwords do not match.");
      return;
    }

    try {
      setStatus("loading");
      await resetPasswordApi(token, newPassword);
      setStatus("success");
      setErrorMessage("");
      setTimeout(() => navigate("/"), 1200);
    } catch (err) {
      setStatus("error");
      setErrorMessage(
        err.response?.data?.message ||
          err.response?.data?.toString() ||
          "Invalid or expired token. Please request a new reset link."
      );
    }
  };

  const passwordError = touched && !newPassword;
  const confirmError = touched && newPassword !== confirmPassword;

  if (status === "invalid_token") {
    return (
      <Box>
        <Center minH="100vh" bg={pageBg} p={4} flexDirection="column">
          <Box maxW="md" w="full" bg={cardBg} p={8} borderRadius="lg" boxShadow="lg">
            <Heading as="h2" size="lg" textAlign="center" mb={4} color={headingColor}>
              Invalid reset link
            </Heading>
            <Alert status="error" borderRadius="md" mb={4}>
              <AlertIcon />
              <AlertDescription>
                Missing or invalid token. Please use the link from your email or request a new password reset.
              </AlertDescription>
            </Alert>
            <Text
              as="span"
              color="blue.500"
              fontWeight="600"
              cursor="pointer"
              onClick={() => navigate("/forgot-password")}
            >
              Request new reset link
            </Text>
          </Box>
        </Center>
      </Box>
    );
  }

  return (
    <Box>
      <Center minH="100vh" bg={pageBg} p={4} flexDirection="column">
        <Box textAlign="center">
          <img
            src={logo}
            alt="ZB Logo"
            style={{ width: "100px", height: "100px", marginBottom: "20px" }}
          />
          <Heading as="h1" size="2xl" mb={10} color={headingColor}>
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
          <Heading
            as="h2"
            size="lg"
            textAlign="center"
            mb={6}
            color={headingColor}
          >
            Reset Password
          </Heading>

          <form onSubmit={handleSubmit} autoComplete="off">
            <Stack spacing={4}>
              <FormControl isInvalid={passwordError} isRequired>
                <FormLabel color={labelColor}>New Password</FormLabel>
                <Input
                  type="password"
                  name="newPassword"
                  placeholder="Enter your new password"
                  value={newPassword}
                  onChange={(event) => {
                    setNewPassword(event.target.value);
                    if (status !== "idle") setStatus("idle");
                  }}
                  onBlur={() => setTouched(true)}
                  autoComplete="new-password"
                />
                <FormErrorMessage>Password is required.</FormErrorMessage>
              </FormControl>

              <FormControl isInvalid={confirmError} isRequired>
                <FormLabel color={labelColor}>Confirm Password</FormLabel>
                <Input
                  type="password"
                  name="confirmPassword"
                  placeholder="Confirm new password"
                  value={confirmPassword}
                  onChange={(event) => {
                    setConfirmPassword(event.target.value);
                    if (status !== "idle") setStatus("idle");
                  }}
                  onBlur={() => setTouched(true)}
                  autoComplete="new-password"
                />
                <FormErrorMessage>Passwords do not match.</FormErrorMessage>
              </FormControl>

              {status === "error" && (
                <Alert status="error" borderRadius="md">
                  <AlertIcon />
                  <AlertDescription>{errorMessage}</AlertDescription>
                </Alert>
              )}

              {status === "success" && (
                <Alert status="success" borderRadius="md">
                  <AlertIcon />
                  <AlertDescription>
                    Password has been reset successfully. Redirecting...
                  </AlertDescription>
                </Alert>
              )}

              <Button
                type="submit"
                size="lg"
                width="full"
                colorScheme="brand"
                isLoading={status === "loading"}
                loadingText="Resetting..."
              >
                Reset Password
              </Button>

              <Text fontSize="sm" color={labelColor} textAlign="center">
                Remember your password?{" "}
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

export default ResetPassword;
