import Image from 'next/image'
import Tooltip from '@material-ui/core/Tooltip'
import { buildArgs } from '../lib/environment'
import sponsor from '../public/powered-by-vercel.svg'
import styles from './footer.module.scss'

export default function Footer(props: { hideDisclaimer?: boolean }) {
  // const history = useHistory();
  // const [easterEgg, setEasterEgg] = useState<number>(0);

  // const handleClick = (e: React.MouseEvent<HTMLHeadingElement, MouseEvent>) => {
  //   e.preventDefault();
  //   setEasterEgg(x => x + 1);
  // }

  // useEffect(() => {
  //   if(easterEgg >= 3) {
  //     setEasterEgg(0);
  //     history.push('/admin');
  //   }
  // }, [easterEgg]);

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
            {/* {props.hideDisclaimer ? (
              <></>
            ) : (
              <p>
                <em>
                  Not affiliated with the University of Houston. Data is sourced
                  directly from the University of Houston.
                </em>
              </p>
            )} */}
          </div>
          <div className="col-sm">
            <div className={styles.sponsor}>
              <Tooltip title="CougarGrades.io is sponsored by Vercel">
                <a href="https://vercel.com/?utm_source=cougargrades&utm_campaign=oss">
                  <Image 
                    src={sponsor}
                    alt="Powered by Vercel"
                  />
                </a>
              </Tooltip>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
