import { useParams } from "react-router";
import {
  Box,
  Button,
  Divider,
  ImageList,
  ImageListItem,
  Typography,
} from "@mui/material";
import { useCallback, useState } from "react";
import { useProfile } from "@/libs/hooks/useProfile";
import PhotoUploadWidget from "@/shared/components/PhotoUploadWidget";
import StarButton from "@/shared/components/StarButton";
import DeleteButton from "@/shared/components/DeleteButton";

export default function ProfilePhotos() {
  const { id } = useParams();
  const { photos, isCurrentUser, uploadPhoto, setMainPhoto, deletePhoto } =
    useProfile(id);

  const [editMode, setEditMode] = useState(false);

  const handleUpload = useCallback(
    async (file: Blob) => {
      await uploadPhoto(file, {
        onSuccess: () => {
          setEditMode(false);
        },
      });
    },
    [uploadPhoto]
  );

  const handleDelete = useCallback(
    async (id: string) => {
      await deletePhoto(id);
    },
    [deletePhoto]
  );

  return (
    <Box>
      <Box display="flex" justifyContent="space-between">
        <Typography variant="h5">Photos</Typography>

        {isCurrentUser && (
          <Button onClick={() => setEditMode(!editMode)}>
            {editMode ? "Cancel" : "Add photo"}
          </Button>
        )}
      </Box>
      <Divider sx={{ my: 2 }} />

      <Box>
        {editMode ? (
          <PhotoUploadWidget onUpload={handleUpload} />
        ) : (
          <ImageList sx={{ height: 450 }} cols={6} rowHeight={164}>
            <>
              {photos?.map((photo) => (
                <ImageListItem key={photo.id}>
                  <img alt={"user profile image"} src={photo.url} />

                  {isCurrentUser && (
                    <Box
                      sx={{ position: "absolute", top: 0, left: 0 }}
                      onClick={() => {
                        setMainPhoto(photo.id);
                      }}
                    >
                      <StarButton selected={photo.isMain} />
                    </Box>
                  )}

                  {!photo.isMain && (
                    <Box
                      sx={{ position: "absolute", top: 0, right: 0 }}
                      onClick={() => handleDelete(photo.id)}
                    >
                      <DeleteButton />
                    </Box>
                  )}
                </ImageListItem>
              ))}
            </>
          </ImageList>
        )}
      </Box>
    </Box>
  );
}
