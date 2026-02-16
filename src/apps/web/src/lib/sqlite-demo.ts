
import { createSQLiteThread, createHttpBackend, createSQLiteHTTPPool, type SQLiteHTTPPool, initSyncSQLite } from 'sqlite-wasm-http'
import type { RowArray, SQLBindable } from 'sqlite-wasm-http/sqlite3.js';

const remoteURL = 'https://velivole.b-cdn.net/maptiler-osm-2017-07-03-v3.6.1-europe.mbtiles';
export const SAMPLE_QUERY = `
SELECT zoom_level, tile_column, tile_row, tile_data
FROM tiles
WHERE zoom_level = 10 AND tile_column = 600 AND tile_row = 600`

export async function query(query: string, ...parameters: SQLBindable[]): Promise<any> {
  const httpBackend = createHttpBackend({
    maxPageSize: 4096,
    timeout: 30000,
    backendType: 'sync'
  });
  const sqlite3 = await initSyncSQLite({ http: httpBackend });
  const db = new sqlite3.oo1.DB({
    filename: `file:${encodeURI(remoteURL)}`,
    vfs: 'http'
  })
  try {
    return db.exec(SAMPLE_QUERY, {
      returnValue: 'resultRows',
      rowMode: 'array',
    })
  }
  finally {
    db.close();
  }
}

export async function query2(query: string, ...parameters: SQLBindable[]): Promise<any> {
  const httpBackend = createHttpBackend({
    maxPageSize: 4096,
    timeout: 30000,
  });
  const db = await createSQLiteThread({ http: httpBackend });
  try {
    // This API is compatible with all SQLite VFS
    await db('open', { filename: `file:${encodeURI(remoteURL)}`, vfs: 'http' });
    await db('exec', {
      sql: query,
      bind: { $col: 600, $row: 600 },
      callback: (msg) => {
        if (msg.row) {
          console.log(msg.columnNames);
          console.log(msg.row);
        } else {
          console.log('end');
        }
      }
    });
  }
  finally {
    // This closes the DB connection
    await db('close', {});
    // This terminates the SQLite worker
    db.close();
    await httpBackend.close();
  }
}
