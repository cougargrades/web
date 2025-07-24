import Link from 'next/link'
// import Image from 'next/legacy/image'
import useSWR from 'swr'
import Tooltip from '@mui/material/Tooltip'
import Typography from '@mui/material/Typography'
import ErrorIcon from '@mui/icons-material/Error'
import TimeAgo from 'timeago-react'
import { buildArgs } from '../lib/environment'
// import sponsor from '../public/powered-by-vercel.svg'
import styles from './footer.module.scss'
import { ObservableStatus } from '../lib/data/Observable'
import { generateMissingDataMailToLink, useLatestTerm, useMissingData } from '../lib/data/useLatestTerm'

interface SponsorshipInformation {
  totalSponsorCount: number,
  monthlyEstimatedSponsorsIncomeInCents: number,
  monthlyEstimatedSponsorsIncomeFormatted: string,
}

export default function Footer(props: { hideDisclaimer?: boolean }) {
  const { data, error, isLoading } = useSWR<SponsorshipInformation>('https://github-org-stats-au5ton.vercel.app/api/sponsors');
  const status: ObservableStatus = error ? 'error' : (isLoading || !data) ? 'loading' : 'success'
  const { data: termData } = useLatestTerm();
  const { data: missingData } = useMissingData();
  const latestTermFormatted = termData?.latestTermFormatted ?? null;
  const { commitHash, version, buildDate, vercelEnv } = buildArgs; // hopefully works
  return (
    <footer className={styles.footer}>
      <div className="new-container">
        <div className="row g-0">
          <div className="col-sm">
            <h6>@cougargrades/web</h6>
            <p>
              Version: {version}, Commit:{' '}
              <a href={`https://github.com/cougargrades/web/commit/${commitHash}`}>
                {typeof commitHash === 'string'
                  ? commitHash.substring(0, 7)
                  : commitHash}
              </a>
              <br />
              Build date:{' '}
              <span
                title={new Date(
                  buildDate,
                ).toUTCString()}
              >
                {new Date(
                  buildDate,
                ).toLocaleDateString()}
              </span>
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
                      To learn more, <span className="pale"><Link href="/faq/data-updates" >read our FAQ</Link></span>.
                      {/* Also <a href={generateMissingDataMailToLink(missingData)}>bazinga</a> */}
                    </>
                  }>
                    <ErrorIcon fontSize="small" color="warning" />
                  </Tooltip>
                </>
                : ''
              }
              <br />
              { vercelEnv !== 'production' ? <>
              Environment: {vercelEnv}
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
            <p className="text-muted" style={{ textAlign: 'right' }}>
              <small>{
                status === 'success' ?  
                `${data!.totalSponsorCount} people sponsor CougarGrades 
                totalling $${data!.monthlyEstimatedSponsorsIncomeFormatted} per month. Thank you!` : ''
              }</small>
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
