import '@testing-library/jest-dom';
import { render } from '@testing-library/react';
import { InputWithLabel } from '..';


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
