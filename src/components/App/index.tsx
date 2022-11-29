import axios from 'axios';
import React, { ChangeEvent, FormEvent } from 'react';
import { Story } from '../../types/stories.type';
import { List } from '../List';
import { SearchForm } from '../SearchForm';
import {
  API_ENDPOINT, REMOVE_STORY, STORIES_FETCH_FAILURE, STORIES_FETCH_INIT,
  STORIES_FETCH_SUCCESS
} from './constants';
import { getSumComments } from './getSumComments.service';
import { storiesReducer } from './stories.reducer';
import { StyledContainer, StyledHeadlinePrimary } from './styles';
import { useSemipersistentState } from './useSemipersistentState.hook';


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
