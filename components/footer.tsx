import Image from 'next/image'
import Tooltip from '@mui/material/Tooltip'
import useSWR from 'swr'
import { buildArgs } from '../lib/environment'
import sponsor from '../public/powered-by-vercel.svg'
import styles from './footer.module.scss'

interface SponsorshipInformation {
  totalSponsorCount: number,
  monthlyEstimatedSponsorsIncomeInCents: number,
  monthlyEstimatedSponsorsIncomeFormatted: string,
}

export default function Footer(props: { hideDisclaimer?: boolean }) {
  const { data, error, isValidating } = useSWR<SponsorshipInformation>('https://github-org-stats-au5ton.vercel.app/api/sponsors');
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
              { vercelEnv !== 'production' ? <>
              <br />
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
              <iframe className={styles.githubSponsor} src="https://github.com/sponsors/au5ton/button" title="Sponsor au5ton" width="116" height="35" ></iframe>
            </div>
            <p className="text-muted">
              <small>{
                isValidating ? '' : 
                `${data.totalSponsorCount} people sponsor CougarGrades 
                totalling $${data.monthlyEstimatedSponsorsIncomeFormatted} per month. Thank you!`
              }</small>
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
