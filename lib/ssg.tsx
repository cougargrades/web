import { firebaseConfig } from '../lib/environment'

export const onlyOne = (value: string | string[]) => Array.isArray(value) ? value[0] : value;

export async function getStaticData<T>(func: string, fallback: T = undefined) {
  try {
    const { projectId } = firebaseConfig
    const res = await fetch(`https://us-central1-${projectId}.cloudfunctions.net/${func}`)
    const data: T = await res.json()
    return data;
  }
  catch(err) {
    return fallback
  }
}
