import { useAccount } from "@/libs/hooks/useAccount";
import { LockOpen } from "@mui/icons-material";
import { Box, Button, Paper, Typography } from "@mui/material";
import TextField from "@mui/material/TextField";
import { FormEvent } from "react";
import { Link, useNavigate } from "react-router";

export default function RegisterForm() {
  const { registerUser } = useAccount();
  const navigate = useNavigate();

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const credentials = Object.fromEntries(formData);
    await registerUser.mutateAsync(
      {
        email: credentials.email as string,
        password: credentials.password as string,
        displayName: credentials.displayName as string,
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
      onSubmit={onSubmit}
      sx={{
        display: "flex",
        flexDirection: "column",
        p: 3,
        gap: 3,
        maxWidth: "md",
        mx: "auto",
        borderRadius: 3,
      }}
    >
      <Box
        display="flex"
        alignItems="center"
        justifyContent="center"
        gap={3}
        color="secondary.main"
      >
        <LockOpen fontSize="large" />
        <Typography variant="h4">Register</Typography>
      </Box>
      <TextField label="Email" name="email" />
      <TextField label="Display name" name="displayName" />
      <TextField label="Password" type="password" name="password" />
      <Button type="submit" variant="contained" size="large">
        Register
      </Button>
      <Typography sx={{ textAlign: "center" }}>
        Already have an account?
        <Typography sx={{ ml: 2 }} component={Link} to="/login" color="primary">
          Sign in
        </Typography>
      </Typography>
    </Paper>
  );
}
