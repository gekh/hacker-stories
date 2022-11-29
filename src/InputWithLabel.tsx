import React, { ChangeEvent, ReactNode } from 'react';
import styled from 'styled-components';


type InputWithLabelProps = {
  id: string;
  value: string;
  type?: string;
  onInputChange: (event: ChangeEvent<HTMLInputElement>) => void;
  isFocused?: boolean;
  children: ReactNode;
};

const StyledLabel = styled.label`
  border-top: 1px solid #171212;
  border-left: 1px solid #171212;
  padding-left: 5px;
  font-size: 24px;
`;

const StyledInput = styled.input`
  border: none;
  border-bottom: 1px solid #171212;
  background-color: transparent;

  margin: 0 5px;

  font-size: 24px;
`;

const InputWithLabel = ({
  id,
  type = 'text',
  value,
  onInputChange,
  isFocused,
  children,
}: InputWithLabelProps) => {
  const inputRef = React.useRef<HTMLInputElement>(null);

  React.useEffect(() => {
    if (isFocused && inputRef.current !== null) {
      inputRef.current.focus();
    }
  }, [isFocused]);

  return (
    <>
      <StyledLabel htmlFor={id}>{children}</StyledLabel>
      &nbsp;
      <StyledInput
        id={id}
        type={type}
        value={value}
        onChange={onInputChange}
        ref={inputRef}
      />
    </>
  );
};

export { InputWithLabel };
