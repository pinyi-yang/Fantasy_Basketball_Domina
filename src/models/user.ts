import mongoose, {Schema} from 'mongoose';
import Player, {DBIPlayer} from './player';
import Team, {DBITeam} from './team';

const userSchema = new Schema({
  yahooId: {
    type: String,
    required: [true, 'You need to have a yahoo id']
  },
  name: String,
  avatar: String,
  rivalries: [{type: Schema.Types.ObjectId, ref: 'Team'}],
  watchPlayers: [{type: Schema.Types.ObjectId, ref: 'Player'}]
})

export interface DBIUser extends mongoose.Document {
  yahooId: string,
  name: string,
  avatar: string,
  rivalries: DBITeam[],
  watchPlayers: DBIPlayer[],
}

userSchema.set('toObject', {
  transform: function(doc, ret, options) {
    let returnJson = {
      _id: ret._id,
      yahooId: ret.yahooId,
      name: ret.name,
      avatar: ret.avatar,
      rivalries: ret.rivalries,
      watchPlayers: ret.watchPlayers
    }
    return returnJson;
  }
})

export default mongoose.model('User', userSchema);