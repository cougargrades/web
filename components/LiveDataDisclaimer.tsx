import React from 'react'
import Chip from '@mui/material/Chip'
import Tooltip from '@mui/material/Tooltip'
import Typography from '@mui/material/Typography'
import { Temporal } from 'temporal-polyfill'

export function LiveDataBadge() {
  return (
    <Tooltip title="The data below comes directly from a 3rd party service. It is not stored by CougarGrades and can be removed or changed at any time." arrow>
      <Chip label="Remote Data" color="primary" size="small" />
    </Tooltip>
  )
}

export interface LiveDataDisclaimerProps {
  cacheLifetime: Temporal.Duration;
}
export function LiveDataDisclaimer({ cacheLifetime }: LiveDataDisclaimerProps) {
  return (
    <Typography variant="body2" color="text.secondary" fontStyle="italic">
      Remote Data from this service may be outdated by up to <strong style={{ textWrap: 'nowrap' }}>{cacheLifetime.toLocaleString()}</strong> due to <a href="https://www.cloudflare.com/learning/cdn/what-is-caching/">caching</a>.
      {/* <br/>
      This improves performance, reduces strain on 3rd party services, and makes CougarGrades more cost-effective to operate. */}
    </Typography>
  )
}
