import { BoxProps } from '@mui/material';
import type { SeasonalAvailability } from '@/lib/data/seasonableAvailability'
import { formatSeasonCode, SeasonCode } from '@/lib/util'
import type { Property } from 'csstype'
import { EnrollmentInfo, EnrollmentInfoResult } from './enrollment';
import { grade2Color } from './badge';


export const season2Color: Record<SeasonCode, Property.Color> = {
  '01': '#F6BE00',
  '02': '#00866C',
  '03': '#71250E'
}

export interface SeasonalAvailabilityInfoProps {
  seasonalAvailability: SeasonalAvailability;
}

export function SeasonalAvailabilityInfo({ seasonalAvailability, ...props }: SeasonalAvailabilityInfoProps & BoxProps) {
  const data: EnrollmentInfoResult[] = Object.entries(seasonalAvailability.measured)
    .map<EnrollmentInfoResult>(([seasonCode, measuredValue]) => ({
      key: seasonCode,
      title: formatSeasonCode(seasonCode as SeasonCode), // 'totalA' => 'A'
      color: season2Color[seasonCode as SeasonCode] ?? grade2Color['I'],
      value: measuredValue,
      percentage: seasonalAvailability.ratioSorted[seasonCode as SeasonCode] * 100,
      tooltip: `${measuredValue.toLocaleString()} total students have enrolled during ${formatSeasonCode(seasonCode as SeasonCode)}`,
    }));
        

  return (
    <EnrollmentInfo {...props} data={data} barHeight={12}  />
  )
}
