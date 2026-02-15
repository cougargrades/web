
import { VITE_COUGARGRADES_DATA_ORIGIN } from '../environment'

export class BaseDataService {
  baseURL: URL;

  constructor(base?: URL) {
    this.baseURL = base ?? VITE_COUGARGRADES_DATA_ORIGIN;
  }
}
