

declare module "process" {
  global {
    var process: NodeJS.Process;
    namespace NodeJS {
      /**
       * Augments `process.env.*` with those defined in the generated `CloudflareEnv`
       */
      interface ProcessEnv extends CloudflareEnv {}
    }
  }
}


/**
 * Type error: Could not find a declaration file for module 'react-fitty'. '/Users/austin/sandbox/cougargrades/web/node_modules/react-fitty/dist/react-fitty.esm.js' implicitly has an 'any' type.
 * There are types at '/Users/austin/sandbox/cougargrades/web/node_modules/react-fitty/dist/index.d.ts', but this result could not be resolved when respecting package.json "exports". The 'react-fitty' library may need to update its package.json or typings.
 * 
 * See: https://github.com/hexetia/react-fitty/pull/9
 */
declare module 'react-fitty' {
  declare const ReactFitty: React.ForwardRefExoticComponent<React.HTMLAttributes<HTMLDivElement> & {
      children?: React.ReactNode;
      minSize?: number | undefined;
      maxSize?: number | undefined;
      wrapText?: boolean | undefined;
  } & React.RefAttributes<HTMLElement>>;
}