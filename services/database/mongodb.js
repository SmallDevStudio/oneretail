import { MongoClient } from "mongodb";
import nextConnect from 'next-connect';

const client = new MongoClient(process.env.NEXT_PUBLIC_MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

  async function database(req, res, next) {
    req.dbClient = client;
    req.db = client.db('one-retail');
    return next();
  }

  const middleware = nextConnect();
  middleware.use(database);
  export default middleware;