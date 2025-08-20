import { Grid2, Typography } from "@mui/material";
import { useParams } from "react-router";
import { useProfile } from "@/libs/hooks/useProfile";

import ProfileHeader from "./ProfileHeader";
import ProfileContent from "./ProfileContent";

export default function ProfilePage() {
  const { id } = useParams();
  const { profile, isLoadingProfile, isCurrentUser, followUser } =
    useProfile(id);

  const handleFollowUser = () => followUser(profile?.id as string);

  if (isLoadingProfile) return <Typography>Loading...</Typography>;

  if (!profile) return <Typography>Profile not found</Typography>;

  return (
    <Grid2 container>
      <Grid2 size={12}>
        <ProfileHeader
          profile={profile}
          isCurrentUser={isCurrentUser}
          handleFollowUser={handleFollowUser}
        />
        <ProfileContent />
      </Grid2>
    </Grid2>
  );
}
