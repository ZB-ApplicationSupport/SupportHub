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
  Stack,
  Text,
} from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import { requestSignup } from "../signupRequests.api";
import AuthSplitLayout from "./AuthSplitLayout";
import {
  AUTH_BUTTON_PROPS,
  AUTH_INPUT_PROPS,
  AUTH_LABEL_PROPS,
  AUTH_LINK_PROPS,
} from "./authFormStyles";

const SignUp = () => {
  const navigate = useNavigate();

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
    setTouched({ email: true, password: true, confirmPassword: true });

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
      setFormState({ email: "", password: "", confirmPassword: "" });
      setTouched({ email: false, password: false, confirmPassword: false });
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
  const emailFormatError =
    touched.email &&
    formState.email &&
    !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formState.email);
  const passwordError = touched.password && !formState.password;
  const confirmPasswordError = touched.confirmPassword && !formState.confirmPassword;
  const passwordMismatch =
    touched.confirmPassword &&
    formState.password &&
    formState.confirmPassword &&
    formState.password !== formState.confirmPassword;

  const isFormInvalid =
    !formState.email ||
    !formState.password ||
    !formState.confirmPassword ||
    passwordMismatch ||
    emailFormatError;

  return (
    <AuthSplitLayout
      title="Request an account"
      subtitle="Submit a signup request. You will be notified once it is approved."
    >
      <form onSubmit={handleSubmit} aria-label="Signup form" autoComplete="off">
        <Stack spacing={5}>
          <FormControl isInvalid={emailError || emailFormatError} isRequired>
            <FormLabel {...AUTH_LABEL_PROPS}>Email</FormLabel>
            <Input
              name="email"
              type="email"
              placeholder="Enter your email"
              value={formState.email}
              onChange={handleChange}
              onBlur={() => setTouched((prev) => ({ ...prev, email: true }))}
              autoComplete="email"
              {...AUTH_INPUT_PROPS}
            />
            <FormErrorMessage>
              {emailError
                ? "Email is required."
                : emailFormatError
                ? "Invalid email format."
                : ""}
            </FormErrorMessage>
          </FormControl>

          <FormControl isInvalid={passwordError} isRequired>
            <FormLabel {...AUTH_LABEL_PROPS}>Password</FormLabel>
            <Input
              name="password"
              type="password"
              placeholder="Enter your password"
              value={formState.password}
              onChange={handleChange}
              onBlur={() => setTouched((prev) => ({ ...prev, password: true }))}
              autoComplete="new-password"
              {...AUTH_INPUT_PROPS}
            />
            <FormErrorMessage>Password is required.</FormErrorMessage>
          </FormControl>

          <FormControl isInvalid={confirmPasswordError || passwordMismatch} isRequired>
            <FormLabel {...AUTH_LABEL_PROPS}>Confirm password</FormLabel>
            <Input
              name="confirmPassword"
              type="password"
              placeholder="Confirm your password"
              value={formState.confirmPassword}
              onChange={handleChange}
              onBlur={() =>
                setTouched((prev) => ({ ...prev, confirmPassword: true }))
              }
              autoComplete="new-password"
              {...AUTH_INPUT_PROPS}
            />
            <FormErrorMessage>
              {confirmPasswordError
                ? "Password confirmation is required."
                : passwordMismatch
                ? "Passwords do not match."
                : ""}
            </FormErrorMessage>
          </FormControl>

          {status === "error" && (
            <Alert status="error" borderRadius="12px" aria-live="polite">
              <AlertIcon />
              <AlertDescription>
                {errorMessage || "Please fill out all fields."}
              </AlertDescription>
            </Alert>
          )}

          {status === "shortPassword" && (
            <Alert status="error" borderRadius="12px" aria-live="polite">
              <AlertIcon />
              <AlertDescription>
                Password must be at least 8 characters long.
              </AlertDescription>
            </Alert>
          )}

          {status === "mismatch" && (
            <Alert status="error" borderRadius="12px" aria-live="polite">
              <AlertIcon />
              <AlertDescription>
                Passwords do not match. Please confirm again.
              </AlertDescription>
            </Alert>
          )}

          {status === "invalidEmail" && (
            <Alert status="error" borderRadius="12px" aria-live="polite">
              <AlertIcon />
              <AlertDescription>Invalid email format.</AlertDescription>
            </Alert>
          )}

          {status === "success" && (
            <Alert status="success" borderRadius="12px" aria-live="polite">
              <AlertIcon />
              <AlertDescription>
                Request submitted successfully. You will receive an email once your account is approved.
              </AlertDescription>
            </Alert>
          )}

          <Button
            type="submit"
            width="full"
            isLoading={status === "submitting"}
            loadingText="Sending..."
            isDisabled={isFormInvalid || status === "submitting"}
            {...AUTH_BUTTON_PROPS}
          >
            Send request
          </Button>

          <Text fontSize="sm" color="text.muted" textAlign="center">
            Already have an account?{" "}
            <Text as="span" {...AUTH_LINK_PROPS} onClick={() => navigate("/")}>
              Login
            </Text>
          </Text>
        </Stack>
      </form>
    </AuthSplitLayout>
  );
};

export default SignUp;
