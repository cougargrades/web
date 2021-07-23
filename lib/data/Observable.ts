
// export interface SWRResponse<Data> {
//   data?: Data;
//   error?: Error | undefined;
//   isValidating: boolean;
// }

export type ObservableStatus = 'loading' | 'error' | 'success'

// From reactfire
export interface Observable<T> {
  status: ObservableStatus;
  //hasEmitted: boolean;
  //isComplete: boolean;
  data: T;
  error: Error | undefined;
  //firstValuePromise: Promise<void>;
}