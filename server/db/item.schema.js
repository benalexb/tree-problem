import mongoose from 'mongoose';

const { Types } = mongoose.Schema;

export const itemSchema = new mongoose.Schema({
  name: {
    type: Types.String,
    required: true,
    index: { unique: true },
  },
  description: { type: Types.String, required: true },
  parent: Types.String,
});

export default itemSchema;
