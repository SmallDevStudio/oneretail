
export default async function handler(req, res) {
   const { searchParams } = new URL(req.url);
   const { client_id, scope, response_type, redirect_uri, state } = searchParams;

   res.status(200).json({ client_id, scope, response_type, redirect_uri, state });
}