import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';
import { routes } from './routes';
import { dbConnectionConfig } from './db/connectionConfig';
import { getItemModel } from './db/item.model';

// Connect to the database
mongoose.connect(process.env.DB_CONNECTION, dbConnectionConfig);

// Initialize app
const app = express();

// Apply middlewares
app.use(cors());
app.use(morgan('dev'));
app.use(bodyParser.json());

// Register routes
routes(app, {
  // Models
  Item: getItemModel(),
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log('Listening on port', PORT);
});
