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
  useColorModeValue,
} from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import logo from "../../Assets/logo.png";

const ResetPassword = () => {
  const navigate = useNavigate();

  const pageBg = useColorModeValue("gray.100", "slate.900");
  const cardBg = useColorModeValue("white", "slate.800");
  const headingColor = useColorModeValue("gray.700", "white");
  const labelColor = useColorModeValue("gray.700", "gray.200");

  const [email] = useState("lnyandoro@zb.co.zw"); // fixed, not editable
  const [newPassword, setNewPassword] = useState("");
  const [touched, setTouched] = useState(false);
  const [status, setStatus] = useState("idle");

  const handleSubmit = (event) => {
    event.preventDefault();
    setTouched(true);

    if (!newPassword) {
      setStatus("error");
      return;
    }

    setStatus("success");
    setTimeout(() => navigate("/"), 1200);
  };

  const passwordError = touched && !newPassword;

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
              <FormControl >
                <FormLabel color={labelColor}>Email</FormLabel>
                <Input
                  name="email"
                  value={email}
                  readOnly
                  autoComplete="off"
                />
              </FormControl>

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
                <FormErrorMessage>
                  Password is required.
                </FormErrorMessage>
              </FormControl>

              {/* Alerts */}
              {status === "error" && (
                <Alert status="error" borderRadius="md">
                  <AlertIcon />
                  <AlertDescription>
                    Please enter a new password.
                  </AlertDescription>
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
              >
                Reset Password
              </Button>
            </Stack>
          </form>
        </Box>
      </Center>
    </Box>
  );
};

export default ResetPassword;
