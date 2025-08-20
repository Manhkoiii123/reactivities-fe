import { createBrowserRouter } from "react-router";

import ActivityDashboard from "@/features/activities/dashboard/ActivityDashboard";
import ActivityDetailPage from "@/features/activities/details/ActivityDetailPage";
import ActivityForm from "@/features/activities/form/ActivityForm";
import HomePage from "@/features/home/HomePage";
import App from "@/app/layout/App";
import LoginForm from "@/features/accounts/LoginForm";
import RegisterForm from "@/features/accounts/RegisterForm";
import RequireAuth from "./RequireAuth";
import ProfilePage from "@/features/profiles/ProfilePage";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      { path: "", element: <HomePage /> },
      {
        element: <RequireAuth />,
        children: [
          { path: "activities", element: <ActivityDashboard /> },
          { path: "activities/:id", element: <ActivityDetailPage /> },
          { path: "createActivity", element: <ActivityForm key="create" /> },
          { path: "manage/:id", element: <ActivityForm /> },
          { path: "profiles/:id", element: <ProfilePage /> },
        ],
      },
      { path: "login", element: <LoginForm /> },
      { path: "register", element: <RegisterForm /> },
    ],
  },
]);

{
  /* <RequireAuth>
  <ActivityDashboard />
  <ActivityDetailPage />
  <ActivityForm />
  <ActivityForm />
  
</RequireAuth>; */
}
