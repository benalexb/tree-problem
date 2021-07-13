import mongoose from 'mongoose';
import { v4 as getUUID } from 'uuid';
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

/**
 * Creates a random number of range between the given min and max.
 *
 * @param {Number} min
 * @param {Number} max
 * @returns {Number}
 */
export const getRandomNumber = (min = 0, max = 5) => Math.random() * (max - min) + min;

/**
 * Prints the error to the console, closes the database connection, and exits the process.\
 *
 * @param {Error} error
 * @param {Object} mongooseConnection
 */
export const handleError = (error, mongooseConnection) => {
  if (mongooseConnection) mongooseConnection.close();
  console.error(error);
  process.exit(1);
};

/**
 * Creates a new node for the given parent.
 *
 * @param {String} parent
 * @returns {Object}
 */
const createNode = (parent) => {
  const name = getUUID();
  return {
    name,
    parent,
    description: `This is a description of ${name}`,
  };
};

/**
 * Generates new nodes recursively according to the provided depth. Relies on an accumulated array,
 * which receives new entries on each pass.
 *
 * @param {String} parent
 * @param {Array<Object>} list
 * @param {Number} depth
 * @param {Number} currentDepth
 * @returns {Object} node
 */
const treeGen = (parent, list, depth, currentDepth = 0) => {
  const node = createNode(parent);
  const spread = getRandomNumber(0, 2);

  // Siblings
  const childLessSiblings = getRandomNumber(0, 2);
  if (childLessSiblings) {
    for (let i = 0; i <= childLessSiblings; i++) {
      list.push(createNode(parent));
    }
  }

  // Children
  if (currentDepth < depth) {
    for (let k = 0; k < spread; k++) {
      list.push(treeGen(node.name, list, depth, currentDepth + 1));
    }
  }
  return node;
};

/**
 * Creates a random, flat list of hierarchical nodes.
 *
 * @returns {Array<Object>} nodeList
 */
const getRandomTree = () => {
  const depth = getRandomNumber(1, 5);
  const nodeList = [createNode('')];
  nodeList.push(treeGen(nodeList[0].name, nodeList, depth));
  return nodeList;
};

/**
 * Drops all existing records in a collection for a given model.
 *
 * @param {Object} model
 * @returns {Object} removal
 */
const resetModelCollection = async (model) => {
  const removal = await model.deleteMany({});
  console.log(`Removed ${removal.deletedCount} ${model.modelName} records`);
  return removal;
};

/**
 * Inserts items based on the provided array of nodes.
 *
 * @param {Object} Item
 * @param {Array<Object>} data
 * @returns {Object} insertion
 */
const insertItems = async (Item, data = []) => {
  let insertion;
  try {
    insertion = await Item.insertMany(
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
  const useRandomTree = process.argv[2] === 'random';

  try {
    mongooseConnection = await mongoose.createConnection(
      process.env.DB_CONNECTION,
      dbConnectionConfig,
    );

    const Item = getItemModel(mongooseConnection);

    announce('Removing old records');
    await resetModelCollection(Item);

    announce('Inserting Data');
    await insertItems(Item, useRandomTree ? getRandomTree() : SEED_DATA);

    // Close the database connection and exit the process.
    mongooseConnection.close();
    process.exit(0);
  } catch (error) {
    handleError(error, mongooseConnection);
  }
};

runDBTasks();
