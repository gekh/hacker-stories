import { render, screen, fireEvent } from '@testing-library/react';
import { storiesReducer, SearchForm, InputWithLabel, List, Item } from '../App';
import '@testing-library/jest-dom';
import { storyOne, storyTwo, stories } from './fixtures/stories.fixture';


describe('storiesReducer', () => {

  // STORIES_FETCH_INIT
  it('inits story loading', () => {
    const action = { type: 'STORIES_FETCH_INIT' };
    const state = { isLoading: false, isError: false };

    const newState = storiesReducer(state, action);

    const expectedState = { isLoading: true, isError: false };

    expect(newState).toStrictEqual(expectedState);
  });

  // STORIES_FETCH_SUCCESS
  it('succesfully fetches stories', () => {
    const action = { type: 'STORIES_FETCH_SUCCESS', payload: stories };
    const state = { isLoading: true, isError: false };

    const newState = storiesReducer(state, action);

    const expectedState = { isLoading: false, isError: false, data: stories };

    expect(newState).toStrictEqual(expectedState);
  });

  // STORIES_FETCH_FAILURE
  it('fails to fetch stories', () => {
    const action = { type: 'STORIES_FETCH_FAILURE' };
    const state = { isLoading: true, isError: false };

    const newState = storiesReducer(state, action);

    const expectedState = { isLoading: false, isError: true };

    expect(newState).toStrictEqual(expectedState);
  });

  // REMOVE_STORY
  it('removes a story from all stories', () => {
    const action = { type: 'REMOVE_STORY', payload: storyOne };
    const state = { data: stories, isLoading: false, isError: false };

    const newState = storiesReducer(state, action);

    const expectedState = {
      data: [storyTwo],
      isLoading: false,
      isError: false,
    };

    expect(newState).toStrictEqual(expectedState);
  });


});

describe('Item', () => {
  it('renders all properties', () => {
    render(<Item item={storyOne} onRemoveItem={jest.fn()} />);
    expect(screen.getByText('Jordan Walke')).toBeInTheDocument();
    expect(screen.getByText('React')).toHaveAttribute(
      'href',
      'https://reactjs.org/'
    );
  });

  it('renders a clickable dismiss button', () => {
    render(<Item item={storyOne} onRemoveItem={jest.fn()} />);
    expect(screen.getByRole('button')).toBeInTheDocument();
  });

  test('clicking the dismiss button calls the callback handler', () => {
    const handleRemoveItem = jest.fn();
    render(<Item item={storyOne} onRemoveItem={handleRemoveItem} />);
    fireEvent.click(screen.getByRole('button'));
    expect(handleRemoveItem).toHaveBeenCalledTimes(1);
  });
});

describe('SearchForm', () => {
  const searchFormProps = {
    searchTerm: 'React',
    onSearchInput: jest.fn(),
    onSearchSubmit: jest.fn().mockImplementation(e => e.preventDefault()),

  };

  it('renders the input field with its value', () => {
    render(<SearchForm {...searchFormProps} />);
    expect(screen.getByDisplayValue('React')).toBeInTheDocument();
  });

  it('renders the correct label', () => {
    render(<SearchForm {...searchFormProps} />);
    expect(screen.getByLabelText(/Search/)).toBeInTheDocument();
  });

  it('calls onSearchInput on input field change', () => {
    render(<SearchForm {...searchFormProps} />);
    fireEvent.change(screen.getByDisplayValue('React'), {
      target: { value: 'Re' },
    });
    fireEvent.change(screen.getByDisplayValue('React'), {
      target: { value: 'Red' },
    });
    fireEvent.change(screen.getByDisplayValue('React'), {
      target: { value: 'Redu' },
    });
    fireEvent.change(screen.getByDisplayValue('React'), {
      target: { value: 'Redux' },
    });
    expect(searchFormProps.onSearchInput).toHaveBeenCalledTimes(4);
  });

  it('calls onSearchSubmit', () => {
    render(<SearchForm {...searchFormProps} />);
    fireEvent.click(screen.getByRole('button'));
    expect(searchFormProps.onSearchSubmit).toBeCalledTimes(1);
  });

});

describe('InputWithLabel', () => {
  it('renders input field with label', () => {
    const handleInputChange = jest.fn();
    render(<InputWithLabel
      id="search"
      value="React"
      onInputChange={handleInputChange}
    >
      Search:
    </InputWithLabel>);

    expect(screen.getByDisplayValue('React')).toBeInTheDocument();
    expect(screen.getByLabelText(/Search/)).toBeInTheDocument();
  });

  it('renders input field with label', () => {
    const handleInputChange = jest.fn();
    render(<InputWithLabel
      id="search"
      value="React"
      onInputChange={handleInputChange}
    >
      Search:
    </InputWithLabel>);

    fireEvent.change(screen.getByDisplayValue('React'), {
      target: { value: 'Redux' }
    });

    expect(handleInputChange).toBeCalledTimes(1);
  });
});


describe('List', () => {
  it('should display the list of 2 items', () => {
    render(<List list={stories} onRemoveItem={jest.fn()} />);
    expect(screen.getByText('Jordan Walke')).toBeInTheDocument();
    expect(screen.getByText('Dan Abramov, Andrew Clark')).toBeInTheDocument();
    expect(screen.getAllByRole('listitem')).toHaveLength(2);
    screen.getAllByRole('listitem').forEach(el => {
      expect(el).toBeInTheDocument();
    });
  });

  test('clicking the dismiss button calls the callback handler', () => {
    const handleRemoveItem = jest.fn();
    render(<List list={stories} onRemoveItem={handleRemoveItem} />);
    fireEvent.click(screen.getAllByRole('button')[0]);
    expect(handleRemoveItem).toHaveBeenCalledTimes(1);
  });
});
