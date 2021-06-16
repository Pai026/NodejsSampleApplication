var express = require('express');
var generator = require('generate-password')
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.post('/register',function(req,res) {
  var password = generator.generate({
    length:10,
    uppercase: false
  })
  res.send({
    "data":{
      "password":password
    }
  })
})

module.exports = router;
