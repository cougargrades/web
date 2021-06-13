import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router';

import './footer.scss';

interface FooterProps {
  hideDisclaimer?: boolean;
}

export default function Footer(props: FooterProps) {
  const history = useHistory();
  const [easterEgg, setEasterEgg] = useState<number>(0);

  const handleClick = (e: React.MouseEvent<HTMLHeadingElement, MouseEvent>) => {
    e.preventDefault();
    setEasterEgg(x => x + 1);
  }

  useEffect(() => {
    if(easterEgg >= 3) {
      setEasterEgg(0);
      history.push('/admin');
    }
  }, [easterEgg]);

  const commitHash = import.meta.env.SNOWPACK_PUBLIC_GIT_SHA; // hopefully works
  return (
    <footer>
      <h6 onClick={handleClick}>@cougargrades/web</h6>
      <p>
        Version: {import.meta.env.SNOWPACK_PUBLIC_VERSION}, Commit:{' '}
        <a href={`https://github.com/cougargrades/web/commit/${commitHash}`}>
          {typeof commitHash === 'string'
            ? commitHash.substring(0, 7)
            : commitHash}
        </a>
        <br />
        Build date:{' '}
        <span
          title={new Date(
            import.meta.env.SNOWPACK_PUBLIC_BUILD_DATE,
          ).toUTCString()}
        >
          {new Date(
            import.meta.env.SNOWPACK_PUBLIC_BUILD_DATE,
          ).toLocaleDateString()}
        </span>
        <br />
        <a href="https://github.com/cougargrades/web/wiki/Feedback">
          Got feedback?
        </a>
      </p>
      {props.hideDisclaimer ? (
        <></>
      ) : (
        <p>
          <em>
            Not affiliated with the University of Houston. Data is sourced
            directly from the University of Houston.
          </em>
        </p>
      )}
    </footer>
  );
}
