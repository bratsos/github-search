import * as React from 'react';
import styled from 'styled-components';
import { ReactComponent as SearchSvg } from '../assets/search.svg';

const noop = () => {};

interface AutocompleteProps {
  onSelect?: (selectedIndex: number) => void,
  onSearch?: (inputValue: string) => void,
  placeholder?: string,
  children: React.ReactNode[] | React.ReactNode
}

interface AutocompleteItemComposition {
  Item: React.FunctionComponent
}

const AutocompleteItem: React.FunctionComponent = ({ children }) => {
  return (
    <li>
      {children}
    </li>
  )
}

const Autocomplete: React.FunctionComponent<AutocompleteProps> & AutocompleteItemComposition = ({
  onSelect,
  onSearch,
  placeholder,
  children
}) => {
  const [inputValue, setInputValue] = React.useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    setInputValue(value);
    if (onSearch) onSearch(value)
  }

  return (
    <Wrapper>
      <InputWrapper>
        <input
          value={inputValue}
          onChange={handleChange}
          placeholder={placeholder}
          autoFocus
        />
        <SearchSvg />
      </InputWrapper>
      <ul>
        {
          React.Children.map(children, (child) => {
            if (!React.isValidElement(child)) {
              throw new Error('Only valid react elements are allowed in Autocomplete. Check your render method')
            }

            const highlightedWord = child.props.children.replace(
              new RegExp(inputValue, 'gi'), (matchedWord: string) => `<b>${matchedWord}</b>`
            )

            return React.cloneElement(
              child,
              {
                ...child.props,
                children: <span dangerouslySetInnerHTML={{ __html: highlightedWord}} />
              }
            )
          })
        }
      </ul>
    </Wrapper>
  )
}

Autocomplete.defaultProps = {
  placeholder: '',
  onSearch: noop,
  onSelect: noop
}

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  width: 300px;
  margin: 0 auto;
  position: relative;

  ul {
    list-style: none;
    padding: 0;
    margin: 0;
    width: 100%;
    position: absolute;
    top: 50px;
    z-index: 1;
    box-shadow: 0px 2px 4px rgba(0,0,0,.15);
    max-height: 50vh;
    overflow-y: auto;

    li {
      background: white;
      transition: background .15s, color .15s;
      cursor: pointer;

      &:hover {
        background: #4DB6AC;
      }
    }
  }
`

const InputWrapper = styled.div`
  display: inline-block;
  position: relative;
  width: 100%;

  input {
    padding: 10px 10px 10px 30px;
    font-size: 16px;
    min-width: 250px;
    box-shadow: 0px 2px 4px rgba(0,0,0,.15);
    outline: none;
    border: 1px solid #FAFAFA;
    margin-top: 10px;
    width: 100%;
  }

  svg {
    width: 15px;
    height: 15px;
    position: absolute;
    top: calc( 10px + 1px + 20px);
    transform: translateY(-50%);
    left: 10px;

    path {
      fill: gray;
    }
  }
`

Autocomplete.Item = AutocompleteItem;

export default Autocomplete;
