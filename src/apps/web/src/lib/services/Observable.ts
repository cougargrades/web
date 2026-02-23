
import type { UseQueryResult } from '@tanstack/react-query'

// export interface SWRResponse<Data> {
//   data?: Data;
//   error?: Error | undefined;
//   isValidating: boolean;
// }

//export type ObservableStatus = 'loading' | 'error' | 'success'
export type ObservableStatus = UseQueryResult['status'];

// From reactfire
export interface Observable<T> {
  //status: ObservableStatus;
  status: UseQueryResult['status'];
  //hasEmitted: boolean;
  //isComplete: boolean;
  data: T | null;
  error: Error | null;
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