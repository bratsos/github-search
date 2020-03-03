import React from 'react';
import styled from 'styled-components';

import { Wrapper, GlobalStyles } from './App.styles';
import Autocomplete from './Autocomplete';

const ACCESS_TOKEN = process.env.REACT_APP_GITHUB_KEY;

interface GithubItem {
  html_url: string,
  login: string,
  avatar_url: string
};

interface IState {
  autocompleteValue: string,
  autocompleteOptions: GithubItem[],
  isLoading: boolean,
}

interface Action {
  type: string,
  payload?: GithubItem[] | string
}

const initialState = {
  autocompleteValue: '',
  autocompleteOptions: [],
  isLoading: false,
}

const reducer = (state: IState = initialState, { type, payload }: Action): IState => {
  switch (type) {
    case 'reset':
      return initialState;
    case 'set_network_issues':
      return {
        ...state,
        isLoading: false,
      }
    case 'start_loading':
      return {
        ...state,
        isLoading: true
      }
    case 'set_results':
      return {
        ...state,
        autocompleteOptions: Array.isArray(payload) ? payload : [],
        isLoading: false,
      }
    case 'set_autocomplete_value':
      return {
        ...state,
        autocompleteValue: typeof payload === 'string' ? payload : ''
      }
    default:
      return state;
  }
}

function App() {
  const [{
    autocompleteValue,
    autocompleteOptions,
    isLoading,
  }, dispatch] = React.useReducer(reducer, initialState)

  const resetState = () => dispatch({ type: 'reset' })

  React.useEffect(() => {
    let cancel: boolean = false;

    if (!autocompleteValue) {
      resetState();
      return;
    }

    dispatch({ type: 'start_loading' })

    const queryString = new URLSearchParams({
      q: autocompleteValue,
      access_token: ACCESS_TOKEN
    }).toString();


    fetch(`https://api.github.com/search/users?${queryString}`)
        .then(response => response.json())
        .then((response) => {
          if (cancel) return;
          
          dispatch({
            type: 'set_results',
            payload: response.items
          })

          cancel = true;
        })
        .catch(() => resetState())

    return () => { cancel = true }
  }, [autocompleteValue])

  return (
    <>
      <GlobalStyles />
      <Wrapper>
        <h1 className="logo">GITHUB EXPLORER</h1>
        <Autocomplete
          placeholder="Type a github username"
          onSelect={(selectedIndex: number) => window.open(autocompleteOptions[selectedIndex].html_url, '_blank')}
          onSearch={(text: string) => dispatch({ type: 'set_autocomplete_value', payload: text })}
        >
          {
            autocompleteOptions.map((option) => {
              return (
                <Autocomplete.Item
                  key={option.login}
                  value={option.login}
                >
                  {(TokenizedValue: React.ElementType, isHighlighted: boolean) => (
                    <AutoCompleteLink
                      href={option.html_url}
                      target="_blank"
                      rel="noopener"
                      isHighlighted={isHighlighted}
                    >
                      <img src={option.avatar_url} alt={`${option.login} avatar`} />
                      <TokenizedValue />
                    </AutoCompleteLink>
                  )}
                </Autocomplete.Item>
              )
            })
          }
        </Autocomplete>
      </Wrapper>
    </>
  );
}

interface IAutoCompleteLink {
  isHighlighted: boolean
}

const AutoCompleteLink = styled.a<IAutoCompleteLink>`
  text-decoration: none;
  color: ${({ isHighlighted }) => isHighlighted ? '#fff' : '#222'};
  display: flex;
  align-items: center;
  padding: 10px;
  background: ${({ isHighlighted }) => isHighlighted ? '#4DB6AC' : '#fff'};

  img {
    width: 30px;
    height: 30px;
    margin-right: 10px;
  }
`

export default App;
