import { firebaseConfig } from '../lib/environment'

export const onlyOne = (value: string | string[]) => Array.isArray(value) ? value[0] : value;

export async function getPathsData(func: string) {
  const { projectId } = firebaseConfig
  const res = await fetch(`https://us-central1-${projectId}.cloudfunctions.net/${func}`)
  const data: string[] = await res.json()
  return data;
}
