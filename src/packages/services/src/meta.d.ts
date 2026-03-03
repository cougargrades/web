
/**
 * This satisfies TypeScript for accessing `import.meta.env`
 */
interface ImportMeta {
  readonly env: Record<string, any>;
}
