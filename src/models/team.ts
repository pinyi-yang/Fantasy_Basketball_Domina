import mongoose, {Schema} from 'mongoose';

const teamSchema = new Schema({
  key: String,
  owner_yahooId: String,
  name: String,
  logo: String
});

export interface DBITeam extends mongoose.Document {
  key: string,
  owner_yahooId: string,
  name: string,
  logo: string,
}

teamSchema.set('toObject', {
  transform: function(doc, ret, options) {
    let returnJson = {
      _id: ret._id,
      key: ret.key,
      owner_yahooId: ret.owner_yahooId,
      name: ret.name,
      logo: ret.logo,
    }
    return returnJson;
  }
})

export default mongoose.model('Team', teamSchema);