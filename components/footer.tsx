import Image from 'next/image'
import { buildArgs } from '../lib/environment'
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
      <div className="row">
        <div className="col">
          1 of 2
        </div>
        <div className="col">
          2 of 2
        </div>
      </div>
      <r-grid columns="8">
        <r-cell span="1-6" span-s="row">
          <h6 title={`vercel env: ${vercelEnv}`}>@cougargrades/web</h6>
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
        </r-cell>
        <r-cell className={styles.sponsor} span="7.." span-s="row">
          <a href="https://vercel.com/?utm_source=cougargrades&utm_campaign=oss">
            <Image 
              src="/powered-by-vercel.svg"
              alt="Powered by Vercel"
              width={212}
              height={44}
            />
          </a>
        </r-cell>
      </r-grid>
    </footer>
  );
}
