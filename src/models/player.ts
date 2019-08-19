import mongoose, {Schema} from 'mongoose';

const playerSchema = new Schema({
  key: String!,
  firstName: String,
  lastName: String,
  positions: String,
  headshot: String
})

export default mongoose.model('Player', playerSchema);