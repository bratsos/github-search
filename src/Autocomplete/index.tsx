import * as React from 'react';

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
    <div>
      <input
        value={inputValue}
        onChange={handleChange}
        placeholder={placeholder}
        autoFocus
      />
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
    </div>
  )
}

Autocomplete.Item = AutocompleteItem;

export default Autocomplete;
