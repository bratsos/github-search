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
  Item: any
}

type AutoCompleteItemProps = {
  children: Function,
  TokenizedValue: React.ReactNode,
  isHighlighted: boolean
}

const AutocompleteItem: React.ReactNode = React.forwardRef(({ children, TokenizedValue, isHighlighted }: AutoCompleteItemProps, ref: React.Ref<HTMLLIElement>) => {
  return (
    <li className={isHighlighted ? 'highlight' : ''} ref={ref}>
      {children(TokenizedValue, isHighlighted)}
    </li>
  )
})

const Autocomplete: React.FunctionComponent<AutocompleteProps> & AutocompleteItemComposition = ({
  onSelect,
  onSearch,
  placeholder,
  children
}) => {
  const [inputValue, setInputValue] = React.useState('');
  const [highlightedItem, setHighlightedItem] = React.useState(0);

  const childrenCount = React.Children.count(children);

  const childrenRefs = React.useMemo(() => Array.from({
    length: React.Children.count(children)},
    () => React.createRef()
  ), [children]);

  const handleKeyDown = React.useCallback((e: KeyboardEvent) => {
    switch (e.code) {
      case 'ArrowDown': {
        if (highlightedItem === childrenCount -1) return;

        const newHighlightedItemIndex = highlightedItem + 1;
        // @ts-ignore
        if (childrenRefs[newHighlightedItemIndex].current.scrollIntoView) {
          // @ts-ignore
          childrenRefs[newHighlightedItemIndex].current.scrollIntoView({ behavior: 'smooth', block: 'end' });
        }
        setHighlightedItem(newHighlightedItemIndex);
        break;
      }
      case 'ArrowUp': {
        if (highlightedItem === 0) return;

        const newHighlightedItemIndex = highlightedItem - 1
        // @ts-ignore
        if (childrenRefs[newHighlightedItemIndex].current.scrollIntoView) {
          // @ts-ignore
          childrenRefs[newHighlightedItemIndex].current.scrollIntoView({ behavior: 'smooth', block: 'end' });
        }
        setHighlightedItem(newHighlightedItemIndex);
        break;
      }
      case 'Enter':
        if (onSelect) onSelect(highlightedItem)
        break;
      default:
        break;
    }
  }, [childrenCount, childrenRefs, highlightedItem, onSelect])

  React.useEffect(() => {
    if (childrenCount === 0) {
      setHighlightedItem(0);
      return;
    }

    window.addEventListener('keydown', handleKeyDown);

    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [children, childrenCount, handleKeyDown])


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
          React.Children.map(children, (child, index) => {
            if (!React.isValidElement(child)) {
              throw new Error('Only valid react elements are allowed in Autocomplete. Check your render method')
            }

            const highlightedWord = child.props.value.replace(
              new RegExp(inputValue, 'gi'), (matchedWord: string) => `<b>${matchedWord}</b>`
            )

            const TokenizedValue = () => <span dangerouslySetInnerHTML={{ __html: highlightedWord}} />;

            return React.cloneElement(
              child,
              {
                ...child.props,
                ref: childrenRefs[index],
                isHighlighted: highlightedItem === index,
                TokenizedValue,
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
