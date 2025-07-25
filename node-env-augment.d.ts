

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
