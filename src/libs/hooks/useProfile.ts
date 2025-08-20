import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getProfile, getProfilePhotos } from "@/libs/api/profile";
import { ACCOUNT_QUERY_KEY } from "./useAccount";
import { useMemo } from "react";
import agent from "../api/agent";

const PROFILE_QUERY_KEY = {
  all: ["profiles"],
  profile: (id?: string) => [...PROFILE_QUERY_KEY.all, id],
  photos: (id?: string) => [...PROFILE_QUERY_KEY.profile(id), "photos"],
};

export const useProfile = (id?: string) => {
  const queryClient = useQueryClient();
  const user = queryClient.getQueryData<User>(ACCOUNT_QUERY_KEY.user());

  const { data: profile, isLoading: isLoadingProfile } = useQuery({
    queryKey: PROFILE_QUERY_KEY.profile(id as string),
    queryFn: () => getProfile(id as string),
    enabled: !!id,
  });

  const { data: photos, isLoading: isLoadingPhotos } = useQuery({
    queryKey: PROFILE_QUERY_KEY.photos(id as string),
    queryFn: () => getProfilePhotos(id as string),
    enabled: !!id,
  });

  const { mutateAsync: uploadPhoto, isPending: isUploadingPhoto } = useMutation(
    {
      mutationFn: async (file: Blob) => {
        const formData = new FormData();

        formData.append("file", file);
        const response = await agent.post<Photo>("/profiles/photo", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
        return response.data;
      },
      onSuccess: async () => {
        await queryClient.invalidateQueries({
          queryKey: PROFILE_QUERY_KEY.all,
        });
      },
    }
  );

  const { mutateAsync: deletePhoto, isPending: isDeletingPhoto } = useMutation({
    mutationFn: async (id: string) => {
      await agent.delete(`/profiles/photo/${id}`);
    },
    onMutate: async (id: string) => {
      const key = PROFILE_QUERY_KEY.photos(user?.id);
      await queryClient.cancelQueries({ queryKey: key });
      const prevPhotos = queryClient.getQueryData<Photo[]>(key);
      queryClient.setQueryData(key, (prev: Photo[]) => {
        if (!prev) return [];
        return prev.filter((p) => p.id !== id);
      });
      return { prevPhotos };
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: PROFILE_QUERY_KEY.photos(user?.id),
      });
    },
  });

  const { mutate: setMainPhoto, isPending: isSettingMainPhoto } = useMutation({
    mutationFn: async (id: string) => {
      const response = await agent.put(`/profiles/photo/${id}/main`);
      return response.data;
    },
    onMutate: async (id: string) => {
      const key = PROFILE_QUERY_KEY.profile(user?.id);
      const photoKey = PROFILE_QUERY_KEY.photos(user?.id);
      const userKey = ["user"];
      await queryClient.cancelQueries({ queryKey: key });
      await queryClient.cancelQueries({ queryKey: photoKey });
      await queryClient.cancelQueries({ queryKey: userKey });
      const prevProfile = queryClient.getQueryData<User>(key);
      const prevPhotos = queryClient.getQueryData<Photo[]>(photoKey);
      const prevUser = queryClient.getQueryData<User>(userKey);

      queryClient.setQueryData(key, (prev: User) => {
        if (!prev) return null;
        return {
          ...prev,
          imageUrl: prevPhotos?.find((p) => p.id === id)?.url,
        };
      });

      queryClient.setQueryData(userKey, (prev: User) => {
        if (!prev) return null;
        return {
          ...prev,
          imageUrl: prevPhotos?.find((p) => p.id === id)?.url,
        };
      });

      queryClient.setQueryData(photoKey, (prev: Photo[]) => {
        if (!prev) return [];
        return prev.map((p) => {
          if (p.id === id) {
            return {
              ...p,
              isMain: true,
            };
          }
          return {
            ...p,
            isMain: false,
          };
        });
      });
      return { prevProfile, prevPhotos, prevUser };
    },
    onError: (_, id, context) => {
      if (context) {
        queryClient.setQueryData(
          PROFILE_QUERY_KEY.profile(user?.id),
          context.prevProfile
        );
        queryClient.setQueryData(
          PROFILE_QUERY_KEY.photos(user?.id),
          context.prevPhotos
        );
        queryClient.setQueryData(["user"], context.prevUser);
      }
    },

    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: PROFILE_QUERY_KEY.all });
    },
  });

  const isCurrentUser = useMemo(() => {
    if (!user || !profile) return false;
    return user?.id === profile?.id;
  }, [user, profile]);

  return {
    profile,
    isLoadingProfile,
    photos,
    isLoadingPhotos,
    isCurrentUser,
    uploadPhoto,
    isUploadingPhoto,
    setMainPhoto,
    isSettingMainPhoto,
    deletePhoto,
    isDeletingPhoto,
  };
};
