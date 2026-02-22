
import { PopCon } from '@cougargrades/models'
import { env } from 'cloudflare:workers'

export async function recordPopCon(options: Pick<PopCon, 'pathname' | 'type'>) {
  if (!env.COUGARGRADES_SQL) return;

  //INSERT INTO Customers (CustomerID, CompanyName, ContactName) VALUES (1, 'Alfreds Futterkiste', 'Maria Anders'), (4, 'Around the Horn', 'Thomas Hardy'), (11, 'Bs Beverages', 'Victoria Ashworth'), (13, 'Bs Beverages', 'Random Name');
  const insert = env.COUGARGRADES_SQL.prepare(`
    INSERT INTO PopularityContest
      (pathname, metric_type)
    VALUES
      (?, ?)
  `).bind(options.pathname, options.type);
  const res = await insert.run();
}

