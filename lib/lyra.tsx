import React from 'react'
import { useAsync } from 'react-use'
import { create, insertBatch } from '@lyrasearch/lyra'

/**
 * 
 * @param enable Allows delaying the initialization of Lyra until "enable" is met, in case you want to reduce the initial load of the search index process
 * @returns 
 */
export function useLyra(enable: boolean = false) {
  const state = useAsync(async () => {
    if (enable) {
      const courseDb = await create({
        schema: {
          href: 'string',
          courseName: 'string',
          description: 'string',
          publicationTextContent: 'string',
        }
      })
      const instructorDb = await create({
        schema: {
          href: 'string',
          firstName: 'string',
          lastName: 'string',
          legalName: 'string',
        }
      })
      const groupDb = await create({
        schema: {
          href: 'string',
          identifier: 'string',
          name: 'string',
          description: 'string',
        }
      })
      const courseIndex = (await import('@cougargrades/publicdata/bundle/io.cougargrades.searchable/courses.json')).data;
      const instructorIndex = (await import('@cougargrades/publicdata/bundle/io.cougargrades.searchable/instructors.json')).data;
      const groupIndex = (await import('@cougargrades/publicdata/bundle/io.cougargrades.searchable/groups.json')).default;
  
      await insertBatch(courseDb, courseIndex);
      await insertBatch(instructorDb, instructorIndex);
      await insertBatch(groupDb, groupIndex);
      
      return { courseDb, instructorDb, groupDb }
    }
    return
  }, [enable])

  return state
}
