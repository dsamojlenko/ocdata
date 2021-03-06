var zeroPad = function(num, places) {
	var zero = places - num.toString().length + 1;
	return Array(+(zero > 0 && zero)).join("0") + num;
}

module.exports  = {
  isInt: function(n) {
     return typeof n == 'number' && n % 1 == 0;
  },

  getDayName: function(date){
    var days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    return days[date.getDay()];
  },

  formatDay: function(date){
    var day = (date.getDate() < 10) ? '' + '0' + date.getDate() : date.getDate()
      , month = ((date.getMonth() + 1) < 10) ? '' + '0' + (date.getMonth() + 1) : (date.getMonth() + 1)
      , year = date.getFullYear();
    return '' + year + month + day;
  },
  
  timeToSeconds: function(time){
    if(time instanceof Date){
      var timeParts = [ time.getHours(), time.getMinutes(), time.getSeconds() ];
    } else {
      var timeParts = time.split(':');
      if(timeParts.length != 3){
        return null;
      }
    }
    return parseInt(timeParts[0], 10) * 60 * 60 + parseInt(timeParts[1], 10) * 60 + parseInt(timeParts[2], 10);
  },

  secondsToTime: function(seconds){
    var hour = Math.floor(seconds / (60 * 60))
      , minute = Math.floor((seconds - hour * (60 * 60)) / 60)
      , second = seconds - hour * (60 * 60) - minute * 60;
    return ((hour < 10) ? '' + '0' + hour : hour) + ':' + ((minute<10) ? '' + '0' + minute : minute) + ':' + ((second<10) ? '' + '0' + second : second);
  },
  
  fixTime: function(time) {
	  var timeParts = time.split(':');
	  if (parseInt(timeParts[0]) >= 24) { timeParts[0] = zeroPad(parseInt(timeParts[0]) - 24, 2) }
	  return timeParts[0] + ':' + timeParts[1] + ':' + timeParts[2];
  }
  
}