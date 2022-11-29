import { Stories } from "../../types/stories.type";

type StoriesState = {
  data: Stories;
  isLoading: boolean;
  isError: boolean;
};

export type { StoriesState };
