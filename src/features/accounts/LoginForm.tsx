import { FormEvent } from "react";
import LockOpen from "@mui/icons-material/LockOpen";
import { Box, Button, Paper, Typography } from "@mui/material";
import TextField from "@mui/material/TextField";
import { Link, useNavigate } from "react-router";
import { useAccount } from "@/libs/hooks/useAccount";

export default function LoginForm() {
  const { loginUser } = useAccount();
  const navigate = useNavigate();

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const credentials = Object.fromEntries(formData);

    await loginUser.mutateAsync(
      {
        email: credentials.email as string,
        password: credentials.password as string,
      },
      {
        onSuccess: () => {
          navigate("/activities");
        },
      }
    );
  };

  return (
    <Paper
      component="form"
      sx={{
        display: "flex",
        flexDirection: "column",
        p: 3,
        gap: 3,
        maxWidth: "md",
        mx: "auto",
        borderRadius: 3,
      }}
      onSubmit={handleSubmit}
    >
      <Box
        display="flex"
        alignItems="center"
        justifyContent="center"
        gap={3}
        color="secondary.main"
      >
        <LockOpen fontSize="large" />
        <Typography variant="h4">Sign in</Typography>
      </Box>
      <TextField label="Email" name="email" />
      <TextField label="Password" type="password" name="password" />
      <Button type="submit" variant="contained" size="large">
        Login
      </Button>
      <Typography sx={{ textAlign: "center" }}>
        Don't have an account?
        <Typography
          sx={{ ml: 2 }}
          component={Link}
          to="/register"
          color="primary"
        >
          Sign up
        </Typography>
      </Typography>
    </Paper>
  );
}
