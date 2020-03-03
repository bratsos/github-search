import React, { ReactElement } from 'react';
import { render, fireEvent, prettyDOM } from '@testing-library/react';
import Autocomplete from './index';

describe('<Autocomplete', () => {
  test('renders Autocomplete', () => {
    const { container } = render(
      <Autocomplete>
        <Autocomplete.Item value="foo">{() => 'foo'}</Autocomplete.Item>
      </Autocomplete>
    );
    
    expect(container).toBeInTheDocument();
  });
  
  test('renders AutocompleteItems', () => {
    const labels = ['one', 'two', 'three'];
  
    const { getByText, container } = render(
      <Autocomplete>
        {
          labels.map(label => (
            <Autocomplete.Item key={label} value={label}>
              {() => <p>{label}</p>}
            </Autocomplete.Item>
          ))
        }
      </Autocomplete>
    );
    
    labels.forEach(label => {
      const query = getByText(label);
  
      expect(query).toBeInTheDocument();
    })
  
    const autocompleteItemsLength = container.querySelector('ul')?.querySelectorAll('p').length;
  
    expect(autocompleteItemsLength).toBe(3);
  });
  
  test('tokenizes the value of <Autocomplete.Item>', () => {
    const labels = ['one', 'two', 'three'];
  
    const { getByTestId, container } = render(
      <Autocomplete>
        {
          labels.map(label => (
            <Autocomplete.Item key={label} value={label}>
              {(TokenizedValue: React.ElementType) => <p data-testid={label}><TokenizedValue /></p>}
            </Autocomplete.Item>
          ))
        }
      </Autocomplete>
    );
  
    const inputNode = container.querySelector('input');
  
    const partOfALabel = labels[1].slice(1);
  
    if (inputNode) {
      fireEvent.change(inputNode, { target: { value: partOfALabel }})
    }
    
    expect(getByTestId('two').querySelector('b')?.textContent).toBe(partOfALabel);
  });
  
  test('Highlights first element by default', () => {
    const labels = ['one', 'two', 'three'];
    const { container } = render(
      <Autocomplete>
        {
          labels.map(label => (
            <Autocomplete.Item key={label} value={label}>
              {(TokenizedValue: React.ElementType) => <p><TokenizedValue /></p>}
            </Autocomplete.Item>
          ))
        }
      </Autocomplete>
    );
    
    expect(container.querySelectorAll('li')[0].classList.contains('highlight')).toBe(true);
  });
  
  test('Highlights second element on one keydown of arrow down', () => {
    const labels = ['one', 'two', 'three'];
    const { container } = render(
      <Autocomplete>
        {
          labels.map(label => (
            <Autocomplete.Item key={label} value={label}>
              {(TokenizedValue: React.ElementType) => <p data-testid={label}><TokenizedValue /></p>}
            </Autocomplete.Item>
          ))
        }
      </Autocomplete>
    );
  
    fireEvent.keyDown(document.body, {
      key: 'ArrowDown', code: 'ArrowDown'
    })
    
    expect(container.querySelectorAll('li')[1].classList.contains('highlight')).toBe(true);
  });
  
  test('Highlights last element and does nothing if arrow down is pressed again', () => {
    const labels = ['one', 'two', 'three'];
    const { container } = render(
      <Autocomplete>
        {
          labels.map(label => (
            <Autocomplete.Item key={label} value={label}>
              {(TokenizedValue: React.ElementType) => <p data-testid={label}><TokenizedValue /></p>}
            </Autocomplete.Item>
          ))
        }
      </Autocomplete>
    );
  
    labels.forEach(() => {
      fireEvent.keyDown(document.body, {
        key: 'ArrowDown', code: 'ArrowDown'
      })
    })
    
    expect(container.querySelectorAll('li')[2].classList.contains('highlight')).toBe(true);
  });  
})  
