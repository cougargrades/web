import React from 'react';

import './footer.scss';

interface FooterProps {
  hideDisclaimer?: boolean;
}

export default function Footer(props: FooterProps) {
  const commitHash =
    import.meta.env.SNOWPACK_PUBLIC_IS_VERCEL === '1'
      ? import.meta.env.SNOWPACK_PUBLIC_VERCEL_COMMIT_SHA
      : import.meta.env.SNOWPACK_PUBLIC_GIT_SHA;

  return (
    <footer>
      <h6>@cougargrades/web</h6>
      <p>
        Version: {import.meta.env.SNOWPACK_PUBLIC_VERSION}, Commit:{' '}
        <a href={`https://github.com/cougargrades/web/commit/${commitHash}`}>
          {typeof commitHash === 'string'
            ? commitHash.substring(0, 7)
            : commitHash}
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
