import { formatDate } from "@/libs/utils/format-date";
import AvatarPopover from "@/shared/components/AvatarPopover";
import { AccessTime, Place } from "@mui/icons-material";
import {
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  Chip,
  Divider,
  Typography,
} from "@mui/material";
import { Link } from "react-router";

type Props = {
  activity: Activity;
};

export default function ActivityCard({ activity }: Props) {
  const { isHost, isGoing, isCanceled } = activity;
  const label = isHost ? "You are hosting" : "You are going";
  const color = isHost ? "secondary" : isGoing ? "warning" : "default";

  if (!activity) return null;

  return (
    <Card elevation={3} sx={{ borderRadius: 3 }}>
      <Box display="flex" alignItems="center" justifyContent="space-between">
        <CardHeader
          avatar={
            <Avatar
              sx={{ height: 80, width: 80 }}
              src={activity.host.imageUrl || undefined}
            />
          }
          title={activity?.title}
          subheader={
            <>
              Hosted by{" "}
              <Link to={`/profiles/${activity.hostId}`}>
                {activity.host.displayName}
              </Link>
            </>
          }
        />
        <Box display="flex" flexDirection="column" gap={2} mr={2}>
          {(isHost || isGoing) && (
            <Chip
              label={label}
              color={color}
              sx={{ borderRadius: 2 }}
              variant="outlined"
            />
          )}
          {isCanceled && (
            <Chip
              label="Cancelled"
              color="error"
              sx={{ borderRadius: 2 }}
              variant="outlined"
            />
          )}
        </Box>
      </Box>

      <Divider sx={{ mb: 3 }} />

      <CardContent sx={{ p: 0 }}>
        <Box display="flex" alignItems="center" mb={2} px={2}>
          <Box display="flex" flexGrow={0} alignItems="center">
            <AccessTime sx={{ mr: 1 }} />
            <Typography variant="body2" noWrap>
              {formatDate(activity?.date)}
            </Typography>
          </Box>

          <Place sx={{ ml: 3, mr: 1 }} />
          <Typography variant="body2">{activity.venue}</Typography>
        </Box>
        <Divider />
        <Box
          display="flex"
          gap={2}
          sx={{ backgroundColor: "grey.200", py: 3, pl: 3 }}
        >
          {activity.attendees.map((attendee) => (
            <AvatarPopover key={attendee.id} profile={attendee} />
          ))}
        </Box>
      </CardContent>
      <CardContent sx={{ pb: 2 }}>
        <Typography variant="body2">{activity.description}</Typography>
        <Button
          component={Link}
          to={`/activities/${activity.id}`}
          size="medium"
          variant="contained"
          sx={{ display: "flex", justifySelf: "self-end", borderRadius: 3 }}
        >
          View
        </Button>
      </CardContent>
    </Card>
  );
}
