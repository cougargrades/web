
import { z } from 'zod'
import * as Average from './Statistics/Average';
import * as StandardDeviation from './Statistics/StandardDeviation';
import * as MaxMinRange from './Statistics/MaxMinRange';

export type GPA = z.infer<typeof GPA>
export const GPA = z.object({
  average: z.number(),
  standardDeviation: z.number(),
  maximum: z.number(),
  minimum: z.number(),
  range: z.number(),
  median: z.number(),
  _average: Average.Average,
  _standardDeviation: StandardDeviation.StandardDeviation,
  _mmr: MaxMinRange.MaxMinRange,
})

export function include(self: GPA, x: number): GPA {
  // Update source values
  Average.include(self._average, x);
  StandardDeviation.include(self._standardDeviation, x);
  MaxMinRange.include(self._mmr, x);

  // Recompute shortcut values
  self.average = Average.value(self._average);
  self.standardDeviation = StandardDeviation.value(self._standardDeviation);
  self.maximum = self._mmr.maximum;
  self.minimum = self._mmr.minimum;
  self.range = self._mmr.range;

  // chain
  return self;
}

export function init(): GPA {
  return {
    average: 0,
    standardDeviation: 0,
    maximum: 0,
    minimum: 0,
    range: 0,
    median: 0,
    _average: Average.init(),
    _standardDeviation: StandardDeviation.init(),
    _mmr: MaxMinRange.init(),
  };
}
