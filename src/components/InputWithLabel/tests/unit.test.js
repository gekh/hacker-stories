import '@testing-library/jest-dom';
import { fireEvent, render, screen } from '@testing-library/react';
import { InputWithLabel } from '..';


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
