
// export interface SWRResponse<Data> {
//   data?: Data;
//   error?: Error | undefined;
//   isValidating: boolean;
// }

// From reactfire
export interface Observable<T> {
  status: 'loading' | 'error' | 'success';
  //hasEmitted: boolean;
  //isComplete: boolean;
  data: T;
  error: Error | undefined;
  //firstValuePromise: Promise<void>;
}