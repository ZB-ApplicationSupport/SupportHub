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
} from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import AuthSplitLayout from "../components/AuthSplitLayout";
import {
  AUTH_BUTTON_PROPS,
  AUTH_INPUT_PROPS,
  AUTH_LABEL_PROPS,
} from "../components/authFormStyles";
import { resetPassword } from "../forgotPassword.api";

const ResetPassword = () => {
  const navigate = useNavigate();
  const params = new URLSearchParams(window.location.search);
  const [email, setEmail] = useState(params.get("email") || "");
  const [code, setCode] = useState(params.get("code") || "");
  const [newPassword, setNewPassword] = useState("");
  const [touched, setTouched] = useState(false);
  const [status, setStatus] = useState("idle");

  const handleSubmit = async (event) => {
    event.preventDefault();
    setTouched(true);

    if (!email || !code || !newPassword) {
      setStatus("error");
      return;
    }

    try {
      setStatus("loading");
      await resetPassword({ email, code, newPassword });
      setStatus("success");
      setTimeout(() => navigate("/"), 1200);
    } catch (error) {
      setStatus("error");
    }
  };

  const emailError = touched && !email;
  const codeError = touched && !code;
  const passwordError = touched && !newPassword;

  return (
    <AuthSplitLayout
      title="Reset password"
      subtitle="Choose a new password for your SupportHub account."
    >
      <form onSubmit={handleSubmit} autoComplete="off">
        <Stack spacing={5}>
          <FormControl isInvalid={emailError} isRequired>
            <FormLabel {...AUTH_LABEL_PROPS}>Email</FormLabel>
            <Input
              name="email"
              type="email"
              value={email}
              onChange={(event) => {
                setEmail(event.target.value);
                if (status !== "idle") setStatus("idle");
              }}
              onBlur={() => setTouched(true)}
              autoComplete="email"
              {...AUTH_INPUT_PROPS}
            />
            <FormErrorMessage>Email is required.</FormErrorMessage>
          </FormControl>

          <FormControl isInvalid={codeError} isRequired>
            <FormLabel {...AUTH_LABEL_PROPS}>Reset code</FormLabel>
            <Input
              name="code"
              placeholder="Enter reset code"
              value={code}
              onChange={(event) => {
                setCode(event.target.value);
                if (status !== "idle") setStatus("idle");
              }}
              onBlur={() => setTouched(true)}
              autoComplete="one-time-code"
              {...AUTH_INPUT_PROPS}
            />
            <FormErrorMessage>Reset code is required.</FormErrorMessage>
          </FormControl>

          <FormControl isInvalid={passwordError} isRequired>
            <FormLabel {...AUTH_LABEL_PROPS}>New password</FormLabel>
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
              {...AUTH_INPUT_PROPS}
            />
            <FormErrorMessage>Password is required.</FormErrorMessage>
          </FormControl>

          {status === "error" && (
            <Alert status="error" borderRadius="12px">
              <AlertIcon />
              <AlertDescription>Please enter your email, reset code, and new password.</AlertDescription>
            </Alert>
          )}

          {status === "success" && (
            <Alert status="success" borderRadius="12px">
              <AlertIcon />
              <AlertDescription>
                Password has been reset successfully. Redirecting...
              </AlertDescription>
            </Alert>
          )}

          <Button
            type="submit"
            width="full"
            isLoading={status === "loading"}
            {...AUTH_BUTTON_PROPS}
          >
            Reset password
          </Button>
        </Stack>
      </form>
    </AuthSplitLayout>
  );
};

export default ResetPassword;
