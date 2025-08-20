import agent from "@/libs/api/agent";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export const ACCOUNT_QUERY_KEY = {
  all: ["user"],
  user: () => [...ACCOUNT_QUERY_KEY.all],
} as const;

export const useAccount = () => {
  const queryClient = useQueryClient();

  const loginUser = useMutation({
    mutationFn: async (credentials: { email: string; password: string }) => {
      const response = await agent.post("/auth/login", credentials);
      return response.data;
    },
    onSuccess: async () => {
      queryClient.invalidateQueries({ queryKey: ACCOUNT_QUERY_KEY.user() });
    },
  });

  const registerUser = useMutation({
    mutationFn: async (credentials: {
      email: string;
      password: string;
      displayName: string;
    }) => {
      const response = await agent.post("/auth/register", credentials);
      return response.data;
    },
  });

  const logoutUser = useMutation({
    mutationFn: async () => {
      const response = await agent.get("/auth/logout");
      return response.data;
    },
    onSuccess: async () => {
      queryClient.removeQueries({ queryKey: ACCOUNT_QUERY_KEY.user() });
    },
  });

  const { data: user, isLoading: isLoadingUser } = useQuery({
    queryKey: ["user"],
    queryFn: async () => {
      const response = await agent.get<User>("/auth/profile");
      return response.data;
    },
    // enabled: !!queryClient.getQueryData(["user"]),
  });

  return { loginUser, registerUser, user, logoutUser, isLoadingUser };
};
