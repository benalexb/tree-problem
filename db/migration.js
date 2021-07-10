import mongoose from 'mongoose';
import { getItemModel } from './item.model';
import { dbConnectionConfig } from './connectionConfig';

const SEED_DATA = [
  {
    name: 'A',
    description: 'This is a description of A',
    parent: '',
  },
  {
    name: 'B',
    description: 'This is a description of B',
    parent: 'A',
  },
  {
    name: 'C',
    description: 'This is a description of C',
    parent: 'A',
  },
  {
    name: 'D',
    description: 'This is a description of D',
    parent: 'A',
  },
  {
    name: 'B-1',
    description: 'This is a description of B-1',
    parent: 'B',
  },
  {
    name: 'B-2',
    description: 'This is a description of B-2',
    parent: 'B',
  },
  {
    name: 'B-3',
    description: 'This is a description of B-3',
    parent: 'B',
  },
];

const announce = (message) => console.log(`\n# ${message} #\n`);

const handleError = (error, mongooseConnection) => {
  if (mongooseConnection) mongooseConnection.close();
  console.error(error);
  process.exit(1);
};

const resetModelCollection = async (model) => {
  const removal = await model.deleteMany({});
  console.log(`Removed ${removal.deletedCount} ${model.modelName} records`);
  return removal;
};

const insertItems = async (Item, data = []) => {
  let insertion;
  try {
    insertion = Item.insertMany(
      // Set parent attribute to null when it is an empty string
      data.map(({ parent, ...attributes }) => ({ ...attributes, parent: parent || null })),
    );
    console.log(`Inserted ${insertion.length} Item records`);
  } catch (error) {
    handleError(error);
  }
  return insertion;
};

const runDBTasks = async () => {
  let mongooseConnection;

  try {
    mongooseConnection = await mongoose.createConnection(
      process.env.DB_CONNECTION,
      dbConnectionConfig,
    );

    const Item = getItemModel(mongooseConnection);

    announce('Removing old records');
    await resetModelCollection(Item);

    announce('Inserting Data');
    await insertItems(Item, SEED_DATA);

    // Close the database connection and exit the process.
    mongooseConnection.close();
    process.exit(0);
  } catch (error) {
    handleError(error, mongooseConnection);
  }
};

runDBTasks();
