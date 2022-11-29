import React, { ChangeEvent, FormEvent } from 'react';
import styled from 'styled-components';
import { StyledButtonLarge } from './button.styled';
import { InputWithLabel } from './InputWithLabel';


type SearchFormProps = {
  searchTerm: string;
  onSearchInput: (event: ChangeEvent<HTMLInputElement>) => void;
  onSearchSubmit: (event: FormEvent<HTMLFormElement>) => void;
};

const StyledSearchForm = styled.form`
  padding: 10px 0 20px 0;
  display: flex;
  align-items: baseline;
`;

const SearchForm = React.memo(
  ({ onSearchSubmit, onSearchInput, searchTerm }: SearchFormProps) => (
    <StyledSearchForm onSubmit={onSearchSubmit}>
      <InputWithLabel
        id="search"
        value={searchTerm}
        isFocused
        onInputChange={onSearchInput}
      >
        <strong>Search:</strong>
      </InputWithLabel>

      <StyledButtonLarge type="submit" disabled={!searchTerm}>
        Submit
      </StyledButtonLarge>
    </StyledSearchForm>
  )
);
SearchForm.displayName = 'SearchForm';

export { SearchForm };
