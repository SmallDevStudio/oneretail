// pages/api/some-api.js
export const config = {
    runtime: 'edge',
  };
  
  export default async function handler(req) {
    const { method } = req;
  
    switch (method) {
      case 'GET':
        return new Response(JSON.stringify({ message: 'Hello from Edge!' }), {
          status: 200,
          headers: {
            'Content-Type': 'application/json',
          },
        });
      case 'POST':
        const data = await req.json();
        return new Response(JSON.stringify({ message: 'Data received', data }), {
          status: 200,
          headers: {
            'Content-Type': 'application/json',
          },
        });
      default:
        return new Response(JSON.stringify({ message: 'Method not allowed' }), {
          status: 405,
          headers: {
            'Content-Type': 'application/json',
          },
        });
    }
  }
  