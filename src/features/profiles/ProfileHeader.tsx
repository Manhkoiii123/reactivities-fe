import {
  Avatar,
  Box,
  Button,
  Chip,
  Divider,
  Grid2,
  Paper,
  Stack,
  Typography,
} from "@mui/material";

type Props = {
  profile: Profile;
  isCurrentUser: boolean;
  handleFollowUser: () => Promise<void>;
};

export default function ProfileHeader({
  profile,
  isCurrentUser,
  handleFollowUser,
}: Props) {
  return (
    <Paper elevation={3} sx={{ p: 4, borderRadius: 3 }}>
      <Grid2 container spacing={2}>
        <Grid2 size={8}>
          <Stack direction="row" spacing={3} alignItems="center">
            <Avatar
              src={profile.imageUrl}
              alt={profile.displayName + " image"}
              sx={{ width: 150, height: 150 }}
            />
            <Box display="flex" flexDirection="column" gap={2}>
              <Typography variant="h4">{profile.displayName}</Typography>
              {!isCurrentUser && profile.following && (
                <Chip
                  variant="outlined"
                  color="secondary"
                  label="Following"
                  sx={{ borderRadius: 1 }}
                />
              )}
            </Box>
          </Stack>
        </Grid2>
        <Grid2 size={4}>
          <Stack spacing={2} alignItems="center">
            <Box display="flex" justifyContent="space-around" width="100%">
              <Box textAlign="center">
                <Typography variant="h6">Followers</Typography>
                <Typography variant="h3">
                  {profile.followersCount || 0}
                </Typography>
              </Box>
              <Box textAlign="center">
                <Typography variant="h6">Following</Typography>
                <Typography variant="h3">
                  {profile.followingCount || 0}
                </Typography>
              </Box>
            </Box>
            <Divider sx={{ width: "100%" }} />
            {!isCurrentUser && (
              <Button
                fullWidth
                variant="outlined"
                color={profile.following ? "error" : "success"}
                onClick={handleFollowUser}
              >
                {profile.following ? "Unfollow" : "Follow"}
              </Button>
            )}
          </Stack>
        </Grid2>
      </Grid2>
    </Paper>
  );
}
