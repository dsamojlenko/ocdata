var mongoose = require('mongoose')
  , Schema = mongoose.Schema;

module.exports = mongoose.model('CalendarDate', new Schema({
    service_id        :  { type: String }
  , date              :  { type: Number }
  , exception_type    :  { type: Number }
}, {collection: 'calendardates'}));
