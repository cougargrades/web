
import { VITE_COUGARGRADES_API_ORIGIN } from '../environment'

export class BaseApiService {
  baseURL: URL;

  constructor(base?: URL) {
    this.baseURL = base ?? VITE_COUGARGRADES_API_ORIGIN;
  }
}
