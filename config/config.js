module.exports = {
    development: {
      root: require('path').normalize(__dirname + '/..'),
      app: {
        name: 'OC Data'
      },
      db: 'mongodb://localhost/oc-transpo'
    }
  , test: {

    }
  , production: {

    }
}
