import { Pool, QueryResult } from "pg";

export async function getPgPool(): Promise<Pool> {
  const uri = process.env["POSTGRES_URI"];

  return new Pool({
    connectionString: uri,
  });
}

export interface Querier {
  query(query: string, args?: any[]): Promise<QueryResult>;
}
