var mongoose = require('mongoose')
  , Schema = mongoose.Schema;

var Calendar = mongoose.model('Calendar', new Schema({
    service_id        :  { type: String }
  , monday            :  { type: Number }
  , tuesday           :  { type: Number }
  , wednesday         :  { type: Number }
  , thursday          :  { type: Number }
  , friday            :  { type: Number }
  , saturday          :  { type: Number }
  , sunday            :  { type: Number }
  , start_date        :  { type: Number }
  , end_date          :  { type: Number }
}, {collection: 'calendars'}));
