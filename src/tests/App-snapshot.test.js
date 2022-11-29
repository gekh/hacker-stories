import { render, screen, fireEvent } from '@testing-library/react';
import { storiesReducer, SearchForm, InputWithLabel, List, Item } from '../App';
import '@testing-library/jest-dom';
import { storyOne, storyTwo, stories } from './fixtures/stories.fixture';


describe('Item', () => {
  it('renders a snapshot', () => {
    const { container } = render(<Item item={storyOne} onRemoveItem={jest.fn()} />);
    expect(container.firstChild).toMatchSnapshot();
  });
});

describe('SearchForm', () => {
  const searchFormProps = {
    searchTerm: 'React',
    onSearchInput: jest.fn(),
    onSearchSubmit: jest.fn().mockImplementation(e => e.preventDefault()),
  };

  it('renders a snapshot', () => {
    const { container } = render(<SearchForm {...searchFormProps} />);
    expect(container.firstChild).toMatchSnapshot();
  });
});

describe('InputWithLabel', () => {
  it('renders a snapshot', () => {
    const { container } = render(<InputWithLabel
      id="search"
      value="React"
      onInputChange={jest.fn()}
    >
      Search:
    </InputWithLabel>);

    expect(container.firstChild).toMatchSnapshot();
  });
});
