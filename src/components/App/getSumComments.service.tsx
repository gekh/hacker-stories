import { Story } from "../../types/stories.type";

export const getSumComments = (stories: { data: Story[]; }) =>
  stories.data.reduce(
    (result: number, value: Story) => result + value.num_comments,
    0
  );
