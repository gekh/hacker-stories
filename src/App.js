import React from 'react';
import axios from 'axios';

const STORIES_FETCH_INIT = 'STORIES_FETCH_INIT';
const STORIES_FETCH_SUCCESS = 'STORIES_FETCH_SUCCESS';
const STORIES_FETCH_FAILURE = 'STORIES_FETCH_FAILURE';
const REMOVE_STORY = 'REMOVE_STORY';

const storiesReducer = (state, action) => {
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
        isLoading: true,
        isError: false,
      };

    case REMOVE_STORY:
      return {
        ...state,
        data: state.data.filter(
          (story) => action.payload.objectID !== story.objectID),
      };

    default:
      throw new Error();
  }
};

const useSemipersistentState = (key, initialState) => {
  const [value, setValue] = React.useState(localStorage.getItem('search') || initialState);

  React.useEffect(() => {
    localStorage.setItem(key, value);
  }, [key, value]);

  return [value, setValue];
};

const API_ENDPOINT = 'https://hn.algolia.com/api/v1/search?query=';

const App = () => {

  const [searchTerm, setSearchTerm] = useSemipersistentState('search', 'React');

  const [url, setUrl] = React.useState(`${API_ENDPOINT}${searchTerm}`);

  const [stories, dispatchStories] = React.useReducer(storiesReducer, {
    data: [],
    isLoading: false,
    isError: false,
  });

  const handleFetchStories = React.useCallback(async () => {
    if (searchTerm === '') {
      return;
    }

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

  const handleRemoveStory = (item) => {
    dispatchStories({
      type: REMOVE_STORY,
      payload: item,
    });
  };

  const handleSearchInput = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleSearchSubmit = (event) => {
    setUrl(`${API_ENDPOINT}${searchTerm}`);

    event.preventDefault();
  }

  return (
    <div>
      <h1>My Hacker Stories</h1>

      <SearchForm
        handleSearchSubmit={handleSearchSubmit}
        handleSearchInput={handleSearchInput}
        searchTerm={searchTerm}
      ></SearchForm>

      <hr />

      {stories.isError && <p>Something went wrong...</p>}

      {stories.isLoading ? (
        <p> Is loading...</p>
      ) : (
        <List list={stories.data} onRemoveItem={handleRemoveStory} />
      )}

    </div>
  );
};

const List = ({ list, onRemoveItem }) => (
  <ul>
    {list.map(item =>
      <Item key={item.objectID} item={item} onRemoveItem={onRemoveItem} />
    )}
  </ul>
);

const Item = ({ item, onRemoveItem }) => (
  <li>
    <span>
      <a href={item.url}>{item.title}</a>
    </span>
    {' '}—{' '}
    <span>{item.author}</span>
    {' '}—{' '}
    <span>{item.num_comments}</span>
    {' '}—{' '}
    <span>{item.points}</span>
    {' '}—{' '}
    <span>
      <button type="button" onClick={onRemoveItem.bind(null, item)}>
        Dismiss
      </button>
    </span>
  </li>
);

const InputWithLabel = ({ id, type = 'text', value, onInputChange, isFocused, children }) => {

  const inputRef = React.useRef();

  React.useEffect(() => {
    if (isFocused && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isFocused]);

  return (
    <>
      <label htmlFor={id}>{children}</label>
      &nbsp;
      <input id={id} type={type} value={value} onChange={onInputChange} ref={inputRef} />
    </>
  );
}

const SearchForm = ({ handleSearchSubmit, handleSearchInput, searchTerm }) => {
  return (
    <form onSubmit={handleSearchSubmit}>
      <InputWithLabel
        id="search"
        value={searchTerm}
        isFocused
        onInputChange={handleSearchInput}
      >
        Search:
      </InputWithLabel>

      <button
        type="submit"
        disabled={!searchTerm}
      >
        Submit
      </button>
    </form>
  );
}

export default App;
