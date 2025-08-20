import agent from "./agent";

export const getProfile = async (id: string) => {
  const response = await agent.get<Profile>(`/profiles/${id}`);
  return response.data;
};

export const getProfilePhotos = async (id: string) => {
  const response = await agent.get<Photo[]>(`/profiles/${id}/photos`);
  return response.data;
};
