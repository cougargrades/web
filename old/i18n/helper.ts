
export const isVowel = (char: string) => ['a','e','i','o','u'].includes(char.toLowerCase().substring(0,1))

export const isEmpty = (str: string | undefined): boolean => typeof str === 'string' ? str.length === 0 : true;

export const unwrap = (str: string | undefined): string => typeof str === 'string' ? str : '';

/**
 * From: https://gist.github.com/JamieMason/c1a089f6f1f147dbe9f82cb3e25cd12e
 * @param array 
 * @returns 
 */
export const toOxfordComma = (array: string[]) =>
  array.length === 2
    ? array.join(' and ')
    : array.length > 2
    ? array
        .slice(0, array.length - 1)
        .concat(`and ${array.slice(-1)}`)
        .join(', ')
    : array.join(', ')
