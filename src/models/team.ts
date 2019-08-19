import mongoose, {Schema} from 'mongoose';

const teamSchema = new Schema({
  key: String!
});

export default mongoose.model('Team', teamSchema);