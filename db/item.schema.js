import mongoose from 'mongoose';

const { Types } = mongoose.Schema;

export const itemSchema = new mongoose.Schema({
  name: {
    type: Types.String,
    required: true,
    unique: true,
    index: true,
  },
  description: { type: Types.String, required: true },
  parent: Types.String,
});

export default itemSchema;
