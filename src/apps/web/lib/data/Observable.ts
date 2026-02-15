
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
  data: T | undefined;
  error: Error | undefined;
  //firstValuePromise: Promise<void>;
}

// export type Observable<T> =
//   {
//     status: 'success',
//     data: T,
//     error: undefined
//   } | {
//     status: 'loading',
//     data: undefined,
//     error: undefined;
//   } | {
//     status: 'error',
//     data: undefined,
//     error: Error;
//   };