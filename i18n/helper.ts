
export const isVowel = (char: string) => ['a','e','i','o','u'].includes(char.toLowerCase().substring(0,1))

export const isEmpty = (str: string | undefined): boolean => typeof str === 'string' ? str.length === 0 : true;

export const unwrap = (str: string | undefined): string => typeof str === 'string' ? str : '';
