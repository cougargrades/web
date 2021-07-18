
export interface SWRResponse<Data> {
  data?: Data;
  error?: Error | undefined;
  isValidating: boolean;
}
