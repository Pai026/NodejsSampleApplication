var { addUsers,loginUser, getUser } = require('../services/user_services');
var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.post('/register',async function(req,res) {
  const data = req.body
  var response = await addUsers(data)
  res.statusCode = response.status
  delete response.status
  res.send({
      response
  })
})

router.post('/login',async function(req,res) {
  const data = req.body
  var response = await loginUser(data)
  res.statusCode = response.status
  delete response.status
  res.send({
      response
  })
})

router.get('/getUser',async function(req,res) {
  const token = req.headers["api_key"]
  var response = await getUser(token)
  res.statusCode = response.status
  delete response.status
    res.send({
        response
    })
})

module.exports = router;
