import { Link } from '@tanstack/react-router'
import Tooltip from '@mui/material/Tooltip'
import Typography from '@mui/material/Typography'
import ErrorIcon from '@mui/icons-material/Error'
import TimeAgo from 'timeago-react'
import { API_ORIGIN, BUILD_DATE, COMMIT_SHA, ENVIRONMENT_NAME, VERSION } from '@cougargrades/services/environment'
import type { ObservableStatus } from '../lib/services/Observable'
import { generateMissingDataMailToLink, useLatestTerm, useMissingData } from '../lib/services/useLatestTerm'
import { useSponsorInformation } from '../lib/services/useSponsorInformation'

import styles from './footer.module.scss'

interface SponsorshipInformation {
  totalSponsorCount: number,
  monthlyEstimatedSponsorsIncomeInCents: number,
  monthlyEstimatedSponsorsIncomeFormatted: string,
}

export function Footer(props: { hideDisclaimer?: boolean }) {
  const { data, error, isLoading } = useSponsorInformation();
  const status: ObservableStatus = error ? 'error' : (isLoading || !data) ? 'pending' : 'success'
  const { data: termData } = useLatestTerm();
  const { data: missingData } = useMissingData();
  const latestTermFormatted = termData?.latestTermFormatted ?? null;
  return (
    <footer className={styles.footer}>
      <div className="new-container">
        <div className="row g-0">
          <div className="col-sm">
            <h6>@cougargrades/web</h6>
            <p>
              Version: {VERSION}, Commit:{' '}
              <a href={`https://github.com/cougargrades/web/commit/${COMMIT_SHA}`}>
                {COMMIT_SHA.substring(0, 7)}
              </a>
              <br />
              Build date: <span title={BUILD_DATE.toUTCString()}>{BUILD_DATE.toLocaleDateString()}</span>
              <br />
              Latest Data: <span>{latestTermFormatted ?? 'Unknown'}</span>{' '}
              {
                missingData && missingData.length > 0
                ? <>
                  <Tooltip placement="bottom" arrow enterTouchDelay={100} leaveTouchDelay={10_000} title={
                    <>
                      <Typography color="inherit" variant="subtitle1" sx={{ paddingTop: '0' }}>
                        Grade Data from <strong>{missingData.length}</strong> {missingData.length === 1 ? 'semester is' : 'semesters are'} missing.
                      </Typography>
                      <ul style={{ marginBottom: '0.4rem' }}>
                        {missingData.map(term => 
                          <li key={term.termCode}>
                            {term.formattedTerm} (Ended <TimeAgo datetime={term.termEndDate} title={term.termEndDate.toLocaleDateString()} locale={'en'} />)
                          </li>
                        )}
                      </ul>
                      Would you like to see this data added to the site? You may be able to help!
                      To learn more, <span className="pale"><Link to={"/faq/data-updates" as any} >read our FAQ</Link></span>.
                      {/* Also <a href={generateMissingDataMailToLink(missingData)}>bazinga</a> */}
                    </>
                  }>
                    <ErrorIcon fontSize="small" color="warning" />
                  </Tooltip>
                </>
                : ''
              }
              <br />
              { ENVIRONMENT_NAME !== 'production' ? <>
              Environment: <a href={API_ORIGIN.toString()}>{ENVIRONMENT_NAME}</a>
              </> : <></>}
              <br />
              <a href="https://github.com/cougargrades/web/wiki/Feedback">
                Got feedback?
              </a>
            </p>
          </div>
          <div className={`col-sm ${styles.sponsorRoot}`}>
            <div className={styles.sponsor}>
              {/* So... Vercel cancelled our sponsorship... */}
              {/*  
              <Tooltip title="CougarGrades.io is sponsored by Vercel">
                <a href="https://vercel.com/?utm_source=cougargrades&utm_campaign=oss">
                  <Image 
                    src={sponsor}
                    alt="Powered by Vercel"
                    width={155}
                    height={32}
                  />
                </a>
              </Tooltip>
              */}
              <iframe className={styles.githubSponsor} src="https://github.com/sponsors/au5ton/button" title="Sponsor au5ton" width="116" height="35" ></iframe>
            </div>
            <Typography variant="inherit" color="text.disabled" style={{ textAlign: 'right' }}>
              <small>{
                status === 'success' ?  
                `${data!.totalSponsorCount} people sponsor CougarGrades 
                totalling ${data!.monthlyEstimatedSponsorsIncomeFormatted} per month. Thank you!` : ''
              }</small>
            </Typography>
          </div>
        </div>
      </div>
    </footer>
  );
}
