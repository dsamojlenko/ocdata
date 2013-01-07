var mongoose = require('mongoose')
  , Schema = mongoose.Schema;

var CalendarDate = mongoose.model('CalendarDate', new Schema({
    service_id        :  { type: String }
  , date              :  { type: String }
  , exception_type    :  { type: String }
}, { strict: true }));
