export const dbConnectionConfig = {
  useCreateIndex: true,
  useFindAndModify: false,
  useNewUrlParser: true,
  useUnifiedTopology: true,
  bufferCommands: false, // Disable mongoose buffering
  bufferMaxEntries: 0, // Disable MongoDB driver buffering
};

export default dbConnectionConfig;
