import '@testing-library/jest-dom';
import { fireEvent, render, screen } from '@testing-library/react';
import { SearchForm } from '..';


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
