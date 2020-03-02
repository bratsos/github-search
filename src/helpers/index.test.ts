import { debounce } from './index';

jest.useFakeTimers();

describe('#debounce', () => {
  it('should execute once if it\'s called once after timers', () => {
    const fn = jest.fn();
    const debouncedFn = debounce(fn);

    debouncedFn();

    expect(fn).not.toBeCalled();

    jest.runAllTimers();

    expect(fn).toBeCalledTimes(1);
  })
  it('should execute once if it\'s called multiple time after timers', () => {
    const fn = jest.fn();
    const debouncedFn = debounce(fn);

    for (let i = 0; i < 10; i++) {
      debouncedFn();
    }

    expect(fn).not.toBeCalled();

    jest.runAllTimers();

    expect(fn).toBeCalledTimes(1);
  })
})
