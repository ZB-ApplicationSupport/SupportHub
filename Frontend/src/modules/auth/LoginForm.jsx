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
  Stack
} from "@chakra-ui/react";
import logo from '../../Assets/logo.png';
import { useNavigate } from "react-router-dom";
import { users } from "../../data/users";
import { useAppContext } from "../../context/AppContext";

const LoginForm = () => {
  const navigate = useNavigate();
  const { setUser } = useAppContext();
  const [formState, setFormState] = useState({
    username: "",
    password: "",
  });
  const [touched, setTouched] = useState({ username: false, password: false });
  const [status, setStatus] = useState("idle");

  const handleChange = (event) => {
    setFormState((prev) => ({ ...prev, [event.target.name]: event.target.value }));
    if (status !== "idle") {
      setStatus("idle");
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    setTouched({ username: true, password: true });
    if (!formState.username || !formState.password) {
      setStatus("error");
      return;
    } 
    const matchedUser = users.find(
      (user) =>
        user.active &&
        (user.username === formState.username || user.email === formState.username) &&
        user.password === formState.password
    );
    if (!matchedUser) {
      setStatus("invalid");
      return;
    }
    setUser({
      id: matchedUser.id,
      name: matchedUser.name,
      role: matchedUser.role,
      department: "Case Operations",
      email: matchedUser.email,
    });
    setStatus("success");
    setTimeout(() => navigate("/dashboard"), 500);
  };

  const usernameError = touched.username && !formState.username;
  const passwordError = touched.password && !formState.password;

  return (
    <Box>
        <Center minH="100vh" bg="gray.100" p={4} flexDirection="column" >
            <Box>
                <img src={logo} alt="ZB Logo" style={{ width: '100px', height: '100px', margin: "0 auto 20px auto" }} />
                <Heading as="h1" size="2xl" mb={50} color={"gray.700"} >
                   ZB Support Hub
                </Heading>
            </Box>
            <Box
            maxW="md"
            w="full"
            bg="white"
            p={8}
            borderRadius="lg"
            boxShadow="lg"
            >
            <Heading as="h2" size="lg" textAlign="center" mb={6} color={"gray.700"}>
                Login
            </Heading>
            <form onSubmit={handleSubmit} aria-label="Login form">
      <Stack spacing={4}>
        <FormControl isInvalid={usernameError} isRequired>
          <FormLabel>Username</FormLabel>
          <Input
            name="username"
            placeholder="Enter your username"
            value={formState.username}
            onChange={handleChange}
            onBlur={() => setTouched((prev) => ({ ...prev, username: true }))}
            autoComplete="username"
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
            autoComplete="current-password"
          />
          <FormErrorMessage>Password is required.</FormErrorMessage>
        </FormControl>
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
        <Button type="submit" size="lg" width="full">
          Sign in
        </Button>
      </Stack>
    </form>
            </Box>
        </Center>
    </Box>
  );
};

export default LoginForm;
