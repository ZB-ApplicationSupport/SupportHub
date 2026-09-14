import React, { useEffect, useState } from "react";
import {
  Alert,
  AlertDescription,
  AlertIcon,
  Button,
  Checkbox,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input,
  Stack,
  Text,
} from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import { useAppContext } from "../../../context/AppContext";
import { appConfig } from "../../../config/appConfig";
import { login } from "../auth.api";
import AuthSplitLayout from "./AuthSplitLayout";
import {
  AUTH_BUTTON_PROPS,
  AUTH_INPUT_PROPS,
  AUTH_LABEL_PROPS,
  AUTH_LINK_PROPS,
} from "./authFormStyles";

const REMEMBER_KEY = "supporthub-remember-username";
const REMEMBER_MS = 30 * 24 * 60 * 60 * 1000;

const readRememberedUsername = () => {
  try {
    const raw = localStorage.getItem(REMEMBER_KEY);
    if (!raw) return "";
    const parsed = JSON.parse(raw);
    if (!parsed?.username || !parsed?.until || parsed.until < Date.now()) {
      localStorage.removeItem(REMEMBER_KEY);
      return "";
    }
    return parsed.username;
  } catch (error) {
    return "";
  }
};

const LoginForm = () => {
  const navigate = useNavigate();
  const { setUser } = useAppContext();
  const remembered = readRememberedUsername();
  const [formState, setFormState] = useState({
    username: remembered,
    password: "",
  });
  const [remember, setRemember] = useState(Boolean(remembered));
  const [touched, setTouched] = useState({ username: false, password: false });
  const [status, setStatus] = useState("idle");
  const [authMessage, setAuthMessage] = useState("");

  useEffect(() => {
    const stored = readRememberedUsername();
    if (stored) {
      setFormState((prev) => ({ ...prev, username: stored }));
      setRemember(true);
    }
  }, []);

  const handleChange = (event) => {
    setFormState((prev) => ({ ...prev, [event.target.name]: event.target.value }));
    if (status !== "idle") {
      setStatus("idle");
      setAuthMessage("");
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
      const session = await login({
        username: formState.username,
        password: formState.password,
      });

      localStorage.setItem("token", session.accessToken);
      if (session.refreshToken) {
        localStorage.setItem("refreshToken", session.refreshToken);
      }

      if (remember) {
        localStorage.setItem(
          REMEMBER_KEY,
          JSON.stringify({
            username: formState.username,
            until: Date.now() + REMEMBER_MS,
          })
        );
      } else {
        localStorage.removeItem(REMEMBER_KEY);
      }

      setUser({
        id: session.user.id,
        name: session.user.name,
        role: session.role,
        department: "Case Operations",
        email: session.user.email,
        username: session.user.username || formState.username,
      });

      setStatus("success");
      setTimeout(() => navigate("/dashboard"), 500);
    } catch (err) {
      const statusCode = err.response?.status;
      const keycloakError = err.response?.data?.error;
      const keycloakDescription = err.response?.data?.error_description || "";
      if (keycloakError === "invalid_client" || keycloakError === "unauthorized_client") {
        setStatus("client");
      } else if (statusCode === 401 || keycloakError === "invalid_grant") {
        setStatus("invalid");
        setAuthMessage(keycloakDescription);
      } else if (
        statusCode === 502 ||
        statusCode === 503 ||
        statusCode === 504 ||
        err.code === "ECONNABORTED" ||
        err.code === "ERR_NETWORK"
      ) {
        setStatus("unavailable");
      } else {
        setStatus("error");
      }
    }
  };

  const usernameError = touched.username && !formState.username;
  const passwordError = touched.password && !formState.password;

  return (
    <AuthSplitLayout
      title="Log in to your account"
      subtitle="Welcome back. Please enter your details."
    >
      <form onSubmit={handleSubmit} aria-label="Login form" autoComplete="off">
        <Stack spacing={5}>
          <FormControl isInvalid={usernameError} isRequired>
            <FormLabel {...AUTH_LABEL_PROPS}>Username</FormLabel>
            <Input
              name="username"
              placeholder="Enter your username"
              value={formState.username}
              onChange={handleChange}
              onBlur={() => setTouched((prev) => ({ ...prev, username: true }))}
              autoComplete="off"
              {...AUTH_INPUT_PROPS}
            />
            <FormErrorMessage>Username is required.</FormErrorMessage>
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

          <Stack
            direction="row"
            justify="space-between"
            align="center"
            spacing={3}
          >
            <Checkbox
              isChecked={remember}
              onChange={(event) => setRemember(event.target.checked)}
              colorScheme="brand"
              size="sm"
              sx={{
                ".chakra-checkbox__label": {
                  fontSize: "13px",
                  color: "text.muted",
                  fontWeight: "500",
                },
              }}
            >
              Remember for 30 days
            </Checkbox>
            <Text
              as="button"
              type="button"
              fontSize="13px"
              {...AUTH_LINK_PROPS}
              onClick={() => navigate("/forgot-password")}
            >
              Forgot password
            </Text>
          </Stack>

          {status === "error" && (
            <Alert status="error" borderRadius="12px">
              <AlertIcon />
              <AlertDescription>
                Please enter your username and password to continue.
              </AlertDescription>
            </Alert>
          )}
          {status === "invalid" && (
            <Alert status="error" borderRadius="12px">
              <AlertIcon />
              <AlertDescription>
                {authMessage || "Invalid credentials. Check your username and password."}
              </AlertDescription>
            </Alert>
          )}
          {status === "unavailable" && (
            <Alert status="error" borderRadius="12px">
              <AlertIcon />
              <AlertDescription>
                Cannot reach Keycloak at {appConfig.keycloakBaseUrl || "the configured URL"}. Check that you are on the bank network.
              </AlertDescription>
            </Alert>
          )}
          {status === "client" && (
            <Alert status="error" borderRadius="12px">
              <AlertIcon />
              <AlertDescription>
                Keycloak rejected the app client. Check REACT_APP_KEYCLOAK_CLIENT_ID and REACT_APP_KEYCLOAK_CLIENT_SECRET.
              </AlertDescription>
            </Alert>
          )}
          {status === "success" && (
            <Alert status="success" borderRadius="12px">
              <AlertIcon />
              <AlertDescription>
                Login validated. Proceed to your dashboard.
              </AlertDescription>
            </Alert>
          )}

          <Button type="submit" width="full" {...AUTH_BUTTON_PROPS}>
            Login
          </Button>

          <Text fontSize="sm" color="text.muted" textAlign="center">
            Don&#39;t have an account?{" "}
            <Text
              as="span"
              {...AUTH_LINK_PROPS}
              onClick={() => navigate("/signup")}
            >
              Sign up
            </Text>
          </Text>
        </Stack>
      </form>
    </AuthSplitLayout>
  );
};

export default LoginForm;
