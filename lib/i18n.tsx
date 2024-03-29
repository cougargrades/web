import { useState } from 'react';
import { useRouter } from 'next/router'
import rosetta from 'rosetta'
import * as config from '../i18n/config'

/**
 * See: https://github.com/lukeed/rosetta
 */
export function useRosetta() {
  // get the locale defined by Next.js
  const locale = useRouter().locale;
  // create and maintain an instance of rosetta
  const [stone, _] = useState(rosetta(config));
  // set the default locale, but replace hyphens with underscores because variable names cant contain hyphens in JS
  stone.locale(locale?.replace('-','_'));
  // return the instance
  return stone;
}

export function getRosetta(locale: string = 'en_US') {
  const stone = rosetta(config);
  stone.locale(locale.replace('-','_'));
  return stone;
}

// see: https://www.grammarly.com/blog/plural-nouns/
export const pluralize = ({ quantity, rootWord }: { quantity: number, rootWord: string }) => quantity === 1 ? rootWord : ['s', 'ss', 'sh', 'ch', 'x', 'z'].some(suffix => rootWord.endsWith(suffix)) ? `${rootWord}es` : `${rootWord}s`