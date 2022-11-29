import '@testing-library/jest-dom';
import { render } from '@testing-library/react';
import { SearchForm } from '..';


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
