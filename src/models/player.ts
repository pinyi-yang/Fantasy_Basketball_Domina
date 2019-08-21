import mongoose, {Schema} from 'mongoose';

const playerSchema = new Schema({
  key: String,
  firstName: String,
  lastName: String,
  positions: String,
  headshot: String
})

export interface DBIPlayer extends mongoose.Document {
  key: string,
  firstName: string,
  lastName: string,
  positions: string,
  headshot: string
}

export default mongoose.model('Player', playerSchema);