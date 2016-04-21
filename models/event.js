const mongoose = require('mongoose');
const Schema = mongoose.Schema;

var eventSchema = new Schema({
    name: { type: String, required: true ,lowercase: true},
    price: {type: String},
    sex: { type: String, enum: ['male', 'female','mix'] },
    type: { type: String, enum: ['rock-party', 'dance','chillout'] },
    institution: { type: Schema.Types.ObjectId, ref: 'Institution' },
    // start_time: {type: Date, default: Date.now}
    start_time: {type: String }

});

var Event = mongoose.model('Event', eventSchema);
module.exports = Event;
