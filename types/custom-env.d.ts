// This may be out of date in the future!
// This is copied from this:
// https://github.com/DefinitelyTyped/DefinitelyTyped/blob/1de95b18c70b699063e98a2c8386225df43d6598/types/snowpack-env/index.d.ts
// Some of CougarGrade's expected environment variables were (brazenly) added here

interface ImportMeta extends ImportMeta {
    url: string;
    // TypeScript Bug: https://github.com/microsoft/TypeScript/issues/41468
    // When TS bug is fixed and ecosystem has upgraded, then it will be safe
    // to change `hot` to the more correct "possibly undefined" (hot?: ...).
    readonly hot: ImportMetaHot;
    readonly env: {
        readonly [key: string]: any;
        readonly SNOWPACK_PUBLIC_API_URL: string;
        readonly MODE: string;
        readonly NODE_ENV: string;
        readonly SSR?: boolean;

        // CougarGrades specific (build time)
        readonly SNOWPACK_PUBLIC_GIT_SHA: string;
        readonly SNOWPACK_PUBLIC_VERSION: string;
        readonly SNOWPACK_PUBLIC_BUILD_DATE: string;

        // CougarGrades specific (.env file)
        readonly SNOWPACK_PUBLIC_API_KEY: string;
        readonly SNOWPACK_PUBLIC_AUTH_DOMAIN: string;
        readonly SNOWPACK_PUBLIC_DATABASE_URL: string;
        readonly SNOWPACK_PUBLIC_PROJECT_ID: string;
        readonly SNOWPACK_PUBLIC_STORAGE_BUCKET: string;
        readonly SNOWPACK_PUBLIC_MESSAGING_SENDER_ID: string;
        readonly SNOWPACK_PUBLIC_APP_ID: string;
        readonly SNOWPACK_PUBLIC_MEASUREMENT_ID: string;
    };
}
