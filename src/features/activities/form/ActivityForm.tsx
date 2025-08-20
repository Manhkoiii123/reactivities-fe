import React, { useState, useEffect } from "react";
import { useActivities } from "@/libs/hooks/useActivities";
import {
  Box,
  Button,
  Paper,
  TextField,
  Typography,
  CircularProgress,
} from "@mui/material";
import { useNavigate, useParams } from "react-router";

type Props = {};

export default function ActivityForm({}: Props) {
  const { id } = useParams();
  const isEdit = !!id;
  const navigate = useNavigate();
  const { createActivity, activity, isLoadingActivity } = useActivities(id);

  // Form state
  const [formValues, setFormValues] = useState({
    title: "",
    description: "",
    category: "",
    date: "",
    city: "",
    venue: "",
  });

  // Update form values when activity data loads (for edit mode)
  useEffect(() => {
    if (activity && isEdit) {
      setFormValues({
        title: activity.title || "",
        description: activity.description || "",
        category: activity.category || "",
        date: activity.date
          ? new Date(activity.date).toISOString().split("T")[0]
          : "",
        city: activity.city || "",
        venue: activity.venue || "",
      });
    }
  }, [activity, isEdit]);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setFormValues((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const activityData = {
      ...formValues,
      latitude: 0,
      longitude: 0,
      date: formValues.date
        ? new Date(formValues.date).toISOString()
        : "2025-05-15T12:00:00.000Z",
    } as unknown as Activity;

    createActivity(activityData, {
      onSuccess: () => {
        navigate("/activities");
      },
      onError: (error, variables, context) => {
        console.log(error, variables, context);
      },
    });
  };

  console.log(formValues);

  // Show loading spinner while fetching activity data for edit mode
  if (isEdit && isLoadingActivity) {
    return (
      <Paper sx={{ borderRadius: 3, padding: 3, textAlign: "center" }}>
        <CircularProgress />
        <Typography variant="body1" sx={{ mt: 2 }}>
          Loading activity data...
        </Typography>
      </Paper>
    );
  }

  return (
    <Paper sx={{ borderRadius: 3, padding: 3 }}>
      <Typography variant="h5" gutterBottom color="primary">
        {isEdit ? "Edit activity" : "Create activity"}
      </Typography>
      <Box
        component="form"
        display="flex"
        flexDirection="column"
        gap={3}
        onSubmit={handleSubmit}
      >
        <TextField
          name="title"
          label="Title"
          value={formValues.title}
          onChange={handleInputChange}
        />
        <TextField
          name="description"
          label="Description"
          multiline
          rows={3}
          value={formValues.description}
          onChange={handleInputChange}
        />
        <TextField
          name="category"
          label="Category"
          value={formValues.category}
          onChange={handleInputChange}
        />
        <TextField
          name="date"
          label="Date"
          type="date"
          value={formValues.date}
          onChange={handleInputChange}
        />
        <TextField
          name="city"
          label="City"
          value={formValues.city}
          onChange={handleInputChange}
          disabled={isEdit}
        />
        <TextField
          name="venue"
          label="Venue"
          value={formValues.venue}
          onChange={handleInputChange}
        />
        <Box display="flex" justifyContent="end" gap={3}>
          <Button color="inherit">Cancel</Button>
          <Button type="submit" color="success" variant="contained">
            Submit
          </Button>
        </Box>
      </Box>
    </Paper>
  );
}
