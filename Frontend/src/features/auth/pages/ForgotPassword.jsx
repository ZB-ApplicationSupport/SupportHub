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
import { requestPasswordReset } from "../forgotPassword.api";
import AuthSplitLayout from "../components/AuthSplitLayout";
import {
  AUTH_BUTTON_PROPS,
  AUTH_INPUT_PROPS,
  AUTH_LABEL_PROPS,
  AUTH_LINK_PROPS,
} from "../components/authFormStyles";

const ForgotPassword = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [touched, setTouched] = useState(false);
  const [status, setStatus] = useState("idle");

  const handleSubmit = async (event) => {
    event.preventDefault();
    setTouched(true);

    if (!email) {
      setStatus("error");
      return;
    }

    try {
      setStatus("loading");
      await requestPasswordReset(email);
      setStatus("success");
      setTimeout(() => navigate("/"), 1200);
    } catch (error) {
      setStatus("error");
    }
  };

  const emailError = touched && !email;

  return (
    <AuthSplitLayout
      title="Forgot password"
      subtitle="Enter your email and we will send a reset link if an account exists."
    >
      <form onSubmit={handleSubmit} aria-label="Forgot password form" autoComplete="off">
        <Stack spacing={5}>
          <FormControl isInvalid={emailError} isRequired>
            <FormLabel {...AUTH_LABEL_PROPS}>Email</FormLabel>
            <Input
              name="email"
              placeholder="Enter your email"
              value={email}
              onChange={(event) => {
                setEmail(event.target.value);
                if (status !== "idle") setStatus("idle");
              }}
              onBlur={() => setTouched(true)}
              autoComplete="off"
              {...AUTH_INPUT_PROPS}
            />
            <FormErrorMessage>Email is required.</FormErrorMessage>
          </FormControl>

          {status === "error" && (
            <Alert status="error" borderRadius="12px">
              <AlertIcon />
              <AlertDescription>Please enter your email to continue.</AlertDescription>
            </Alert>
          )}
          {status === "success" && (
            <Alert status="success" borderRadius="12px">
              <AlertIcon />
              <AlertDescription>
                If an account exists for this email, a reset link has been sent. Check your email.
              </AlertDescription>
            </Alert>
          )}

          <Button
            type="submit"
            width="full"
            isLoading={status === "loading"}
            {...AUTH_BUTTON_PROPS}
          >
            Send reset link
          </Button>

          <Text fontSize="sm" color="text.muted" textAlign="center">
            Remembered your password?{" "}
            <Text as="span" {...AUTH_LINK_PROPS} onClick={() => navigate("/")}>
              Back to login
            </Text>
          </Text>
        </Stack>
      </form>
    </AuthSplitLayout>
  );
};

export default ForgotPassword;
