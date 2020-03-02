export const debounce = (callback: (...args: any[]) => any, threshold = 250): any => {
  let timer: number;

  return (...args: any[]) => {
    clearTimeout(timer);

    timer = setTimeout(() => {
      callback(...args);
    }, threshold)
  }
};
