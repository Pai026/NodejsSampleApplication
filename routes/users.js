var { addUsers,loginUser } = require('../services/user_services');
var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.post('/register',async function(req,res) {
  const data = req.body
  var response = await addUsers(data)
  if(response.status == 400)
    res.statusCode = 400
  res.send({
    "data":{
      response
    }
  })
})

router.post('/login',async function(req,res) {
  const data = req.body
  var response = await loginUser(data)
  if(response.status ==404)
    res.statusCode = 404
  res.send({
    "data":{
      response
    }
  })
})

module.exports = router;
