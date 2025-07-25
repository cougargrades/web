// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
//import { env } from 'cloudflare:workers'

// test
// type Data = {
//   name: string;
// };

type Data = { [key: string]: any }

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>,
) {
  res.status(200).json({
    name: "John Doe",
    // NEXTJS_ENV: env.NEXTJS_ENV,
    // EXAMPLE_VARIABLE: env.EXAMPLE_VARIABLE,
    // EXAMPLE_SECRET: env.EXAMPLE_SECRET,
    NEXTJS_ENV: process.env.NEXTJS_ENV,
    EXAMPLE_VARIABLE: process.env.EXAMPLE_VARIABLE,
    EXAMPLE_SECRET: process.env.EXAMPLE_SECRET,
  });
}
