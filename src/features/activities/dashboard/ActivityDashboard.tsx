import { Grid2 } from "@mui/material";
import ActivityList from "./ActivityList";
import ActivityFilters from "./ActivityFilters";
import { useActivities } from "@/libs/hooks/useActivities";

export default function ActivityDashboard() {
  const { activities, isPending } = useActivities();

  return (
    <Grid2 container spacing={3}>
      <Grid2 size={8}>
        {isPending ? <>Loading...</> : <ActivityList activities={activities} />}
      </Grid2>
      <Grid2 size={4} sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
        <ActivityFilters />
      </Grid2>
    </Grid2>
  );
}
