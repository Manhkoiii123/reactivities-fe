import {
  useQuery,
  skipToken,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import {
  getActivities,
  getActivityById,
  createActivity as createActivityApi,
  updateAttendee as updateAttendeeApi,
} from "../api/activities";

const activityQueryKeys = {
  all: ["activities"],
  lists: () => [...activityQueryKeys.all, "list"],
  details: (id?: string) => [...activityQueryKeys.all, "details", id],
} as const;

export const useActivities = (id?: string) => {
  const queryClient = useQueryClient();
  const user = queryClient.getQueryData<User>(["user"]);

  const { data = [], isPending } = useQuery({
    queryKey: activityQueryKeys.lists(),
    queryFn: getActivities,
    select: (data) => {
      if (!data) return [];
      return data.map((activity) => ({
        ...activity,
        isGoing: activity.attendees.some((a) => a.id === user?.id),
        isHost: activity.hostId === user?.id,
      }));
    },
  });

  const { data: activity, isPending: isLoadingActivity } = useQuery({
    queryKey: activityQueryKeys.details(id),
    queryFn: id ? () => getActivityById(id) : skipToken,
    enabled: !!id,
    select: (data) => {
      if (!data) return null;
      return {
        ...data,
        isGoing: data.attendees.some((attendee) => attendee.id === user?.id),
        isHost: data.hostId === user?.id,
      };
    },
  });

  const { mutate: createActivity, isPending: isCreatingActivity } = useMutation(
    {
      mutationFn: (activity: Activity) => createActivityApi(activity),
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: activityQueryKeys.lists() });
      },
    }
  );

  const { mutate: updateAttendee, isPending: isUpdatingAttendee } = useMutation(
    {
      mutationFn: async (activityId: string) => updateAttendeeApi(activityId),
      onMutate: async (activityId) => {
        const key = activityQueryKeys.details(activityId);
        await queryClient.cancelQueries({ queryKey: key });
        const previousActivity = queryClient.getQueryData<Activity>(key);

        queryClient.setQueryData(key, (data: Activity) => {
          if (!data || !user) return null;
          const isHost = data.hostId === user.id;
          const isGoing = data.attendees.some((a) => a.id === user.id);

          return {
            ...data,
            isCanceled: isHost ? !data.isCanceled : data.isCanceled,
            attendees: isGoing
              ? isHost
                ? data.attendees
                : data.attendees.filter((att) => att.id !== user.id)
              : [
                  ...data.attendees,
                  {
                    id: user.id,
                    displayName: user.displayName,
                    imageUrl: user.imageUrl,
                  },
                ],
          };
        });
        return { previousActivity };
      },
      onError: (_, activityId, context) => {
        queryClient.setQueryData(
          activityQueryKeys.details(activityId),
          context?.previousActivity
        );
      },
      onSuccess: (_, activityId) => {
        queryClient.invalidateQueries({
          queryKey: activityQueryKeys.details(activityId),
        });
      },
    }
  );

  return {
    activities: data,
    activity,
    isPending,
    isLoadingActivity,
    createActivity,
    isCreatingActivity,
    updateAttendee,
    isUpdatingAttendee,
  };
};
