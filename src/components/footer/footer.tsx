import React from 'react';

import './footer.scss';

interface FooterProps {
  hideDisclaimer?: boolean;
}

export default function Footer(props: FooterProps) {
  return (
    <footer>
      <h6>@cougargrades/web</h6>
      <p>
        Version: {import.meta.env.SNOWPACK_PUBLIC_VERSION}, Commit:{' '}
        <a
          href={`https://github.com/cougargrades/web/commit/${
            import.meta.env.SNOWPACK_PUBLIC_GIT_SHA
          }`}
        >
          {import.meta.env.SNOWPACK_PUBLIC_GIT_SHA}
        </a>
        <br />
        Built:{' '}
        <span
          title={new Date(
            import.meta.env.SNOWPACK_PUBLIC_BUILD_DATE,
          ).toUTCString()}
        >
          {new Date(
            import.meta.env.SNOWPACK_PUBLIC_BUILD_DATE,
          ).toLocaleDateString()}
        </span>
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
