import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';
import redis from 'redis';
import { promisify } from 'util';
import { routes } from './routes';
import { dbConnectionConfig } from '../db/connectionConfig';
import { getItemModel } from '../db/item.model';

const redisClient = redis.createClient(process.env.REDIS_URL);
const setAsync = promisify(redisClient.set).bind(redisClient);
const getAsync = promisify(redisClient.get).bind(redisClient);
const delAsync = promisify(redisClient.del).bind(redisClient);

// Connect to the database
mongoose.connect(process.env.DB_CONNECTION, dbConnectionConfig);

// Initialize app
const app = express();

// Expose db models and redis client
app.use((req, res, next) => {
  res.locals.models = {
    Item: getItemModel(),
  };
  res.locals.redis = {
    client: redisClient,
    setAsync,
    getAsync,
    delAsync,
  };
  next();
});

// Apply middlewares
app.use(cors());
app.use(morgan('dev'));
app.use(bodyParser.json());

// Register routes
routes(app);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log('Listening on port', PORT);
});
