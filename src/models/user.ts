import mongoose, {Schema} from 'mongoose';
import Player from './player';
import Team from './team';

const userSchema = new Schema({
  yahooId: {
    type: Number,
    required: [true, 'You need to have a yahoo id']
  },
  name: String,
  avatar: String,
  rivalries: [{type: Schema.Types.ObjectId, ref: 'Team'}],
  watchPlayers: [{type: Schema.Types.ObjectId, ref: 'Player'}]
})

userSchema.set('toObject', {
  transform: function(doc, ret, options) {
    let returnJson = {
      _id: ret._id,
      yahooId: ret.yahooId,
      name: ret.name || 'user',
      avatar: ret.avatar || '',
      rivalries: ret.rivalries || [],
      watchPlayers: ret.watchPlayers || []
    }
    return returnJson;
  }
})

export default mongoose.model('User', userSchema);