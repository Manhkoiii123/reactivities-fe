import { Box, Typography } from "@mui/material";
import ActivityCard from "./ActivityCard";

type Props = {
  activities: Activity[];
};

export default function ActivityList({ activities }: Props) {
  if (!activities || activities?.length === 0)
    return <Typography variant="h5">No activities found</Typography>;

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
      {activities.map((activity) => (
        <ActivityCard key={activity.id} activity={activity} />
      ))}
    </Box>
  );
}
