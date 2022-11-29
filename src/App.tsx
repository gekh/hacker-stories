import axios from 'axios';
import React, { ChangeEvent, FormEvent } from 'react';
import styled from 'styled-components';
import { List } from './list';
import { SearchForm } from './SearchForm';
import { StoriesAction } from './stories-acton.type';
import { Stories, Story } from './stories.type';

const API_ENDPOINT = 'https://hn.algolia.com/api/v1/search?query=';
const STORIES_FETCH_INIT = 'STORIES_FETCH_INIT';
const STORIES_FETCH_SUCCESS = 'STORIES_FETCH_SUCCESS';
const STORIES_FETCH_FAILURE = 'STORIES_FETCH_FAILURE';
const REMOVE_STORY = 'REMOVE_STORY';

type StoriesState = {
  data: Stories;
  isLoading: boolean;
  isError: boolean;
};

const storiesReducer = (state: StoriesState, action: StoriesAction) => {
  switch (action.type) {
    case STORIES_FETCH_INIT:
      return {
        ...state,
        isLoading: true,
        isError: false,
      };

    case STORIES_FETCH_SUCCESS:
      return {
        ...state,
        isLoading: false,
        isError: false,
        data: action.payload,
      };

    case STORIES_FETCH_FAILURE:
      return {
        ...state,
        isLoading: false,
        isError: true,
      };

    case REMOVE_STORY:
      return {
        ...state,
        data: state.data.filter(
          (story) => action.payload.objectID !== story.objectID
        ),
      };

    default:
      throw new Error();
  }
};

const useSemipersistentState = (
  key: string,
  initialState: string
): [string, (newValue: string) => void] => {
  const [value, setValue] = React.useState(
    localStorage.getItem('search') || initialState
  );

  React.useEffect(() => {
    localStorage.setItem(key, value);
  }, [key, value]);

  return [value, setValue];
};

const StyledContainer = styled.div`
  height: 100vw;
  padding: 20px;

  background: #83a4d4;
  background: linear-gradient(to left, #b6fbff, #83a4d4);

  color: #171212;
`;

const StyledHeadlinePrimary = styled.h1`
  font-size: 48px;
  font-weight: 300;
  letter-spacing: 2px;
`;

const getSumComments = (stories: { data: Story[]; }) =>
  stories.data.reduce(
    (result: number, value: Story) => result + value.num_comments,
    0
  );

const App = () => {
  const [searchTerm, setSearchTerm] = useSemipersistentState('search', 'React');

  const [url, setUrl] = React.useState(`${API_ENDPOINT}${searchTerm}`);

  const [stories, dispatchStories] = React.useReducer(storiesReducer, {
    data: [],
    isLoading: false,
    isError: false,
  });

  const handleFetchStories = React.useCallback(async () => {
    dispatchStories({ type: STORIES_FETCH_INIT });

    try {
      const result = await axios.get(url);

      dispatchStories({
        type: STORIES_FETCH_SUCCESS,
        payload: result.data.hits,
      });
    } catch {
      dispatchStories({
        type: STORIES_FETCH_FAILURE,
      });
    }
  }, [url]);

  React.useEffect(() => {
    handleFetchStories();
  }, [handleFetchStories]);

  const handleRemoveStory = React.useCallback((item: Story) => {
    dispatchStories({
      type: REMOVE_STORY,
      payload: item,
    });
  }, []);

  const handleSearchInput = React.useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      setSearchTerm(event.target.value);
    },
    [setSearchTerm]
  );

  const handleSearchSubmit = React.useCallback(
    (event: FormEvent<HTMLFormElement>) => {
      setUrl(`${API_ENDPOINT}${searchTerm}`);

      event.preventDefault();
    },
    [searchTerm]
  );

  const sumComments = React.useMemo(() => getSumComments(stories), [stories]);

  // What's going on?
  //! wow easy maaan
  // TODO: update the funciton
  return (
    <StyledContainer>
      <StyledHeadlinePrimary>
        My Hacker Stories with {sumComments} comments
      </StyledHeadlinePrimary>

      <SearchForm
        onSearchSubmit={handleSearchSubmit}
        onSearchInput={handleSearchInput}
        searchTerm={searchTerm}
      ></SearchForm>

      {stories.isError && <p>Something went wrong...</p>}

      {stories.isLoading ? (
        <p> Is loading...</p>
      ) : (
        <List list={stories.data} onRemoveItem={handleRemoveStory} />
      )}
    </StyledContainer>
  );
};

export default App;
export { storiesReducer };
