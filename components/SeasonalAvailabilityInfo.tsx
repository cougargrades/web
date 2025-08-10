import type { Property } from 'csstype'
import type { BoxProps } from '@mui/material'
import { PieChart, pieArcLabelClasses } from '@mui/x-charts/PieChart';
import type { PieValueType } from '@mui/x-charts';
import type { SeasonalAvailability } from '@/lib/data/seasonableAvailability'
import { formatSeasonCode, SeasonCode, sum } from '@/lib/util'
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
  const total = sum(data.map(e => e.value))
        

  return <>
    {/* <EnrollmentInfo {...props} data={data} barHeight={12}  /> */}
    <PieChart
      series={[
        {
          data: [
            ...data.map<PieValueType>(e => ({
              id: e.key,
              value: e.value,
              label: (loc) => loc === 'legend' ? `${e.title} (${e.percentage.toFixed(1)}%)` : e.title,
              color: e.color,
            }))
          ],
          //arcLabel: (slice) => `${(slice.value / total * 100).toFixed(1)}% `,
          valueFormatter: (slice, context) => `${(slice.value / total * 100).toFixed(1)}% of students enrolled during ${slice.label}`
        },
      ]}
      width={150}
      height={150}
      sx={{
        [`& .${pieArcLabelClasses.root}`]: {
          fontWeight: '500',
          textShadow: '0px 1px 2px #000',
        }
      }}
    />
  </>;
}
