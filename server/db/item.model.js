import mongoose from 'mongoose';
import { itemSchema } from './item.schema';

export const getItemModel = (mongooseConnection) => (mongooseConnection || mongoose).model('Item', itemSchema);

export default getItemModel;
