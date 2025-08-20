import { useAccount } from "@/libs/hooks/useAccount";
import { Typography } from "@mui/material";
import { Navigate, Outlet } from "react-router";

export default function RequireAuth() {
  const { user, isLoadingUser } = useAccount();

  if (isLoadingUser) {
    return <Typography>Loading...</Typography>;
  }

  if (!user) {
    return <Navigate to="/login" />;
  }

  return <Outlet />;
}
