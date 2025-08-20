type Activity = {
  id: string;
  createdAt?: string;
  updatedAt?: string;
  title: string;
  description: string;
  category: string;
  isCanceled: boolean;
  city: string;
  venue: string;
  latitude: number;
  longitude: number;
  date: Date | string;
  host: {
    id: string;
    displayName: string;
    imageUrl: string;
    username: string;
  };
  hostId: string;
  attendees: Attendee[];
  isGoing: boolean;
  isHost: boolean;
};

type FormType = "view" | "create" | "close" | "edit";

type User = {
  id: string;
  username: string;
  displayName: string;
  imageUrl: string;
};

type Attendee = User & {
  isHost: boolean;
  following: boolean;
};

type Profile = {
  id: string;
  displayName: string;
  bio?: string;
  imageUrl?: string;
};

type Photo = {
  id: string;
  url: string;
  isMain: boolean;
};
