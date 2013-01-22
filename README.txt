OCDATA is a node.js application that provides a JSON web interface to GTFS data stored in a MongoDB database.

- currently only works with OC Transpo data (Ottawa, ON)
- currently having an issue with times that begin early in the morning (after midnight, before 4am) due to the way GTFS data records times for routes that begin before midnight and end after midnight

