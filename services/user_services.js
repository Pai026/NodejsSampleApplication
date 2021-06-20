var generator = require("generate-password");
var bcrypt = require("bcryptjs");
var { Connection } = require("../common/dbConnection");
var { Email } = require("../common/emailConfig");
var jwt = require("jsonwebtoken");
var ObjectId = require("mongodb").ObjectID;
const { verifyToken } = require("../common/jwtUtilFunctions");

async function addUsers(data) {
  Connection.open();
  const { email, phono } = data;
  var isValidEmail = validateEmail(email);
  var isValidPhone = validatePhoneNumber(phono);
  if (isValidEmail && isValidPhone) {
    const findUser = await Connection.db
      .db("SampleApplication")
      .collection("users")
      .findOne({ email: email });
    if (!findUser) {
      var password = generator.generate({
        length: 10,
        uppercase: false,
      });
      var hashedPass = await bcrypt.hash(password, 10);
      const user = {
        email: email,
        phono: phono,
        userDetails: {},
        password: hashedPass,
      };
      const result = await Connection.db
        .db("SampleApplication")
        .collection("users")
        .insertOne(user);
      sendMail(email, password);
      return {
        username: email,
        password: password,
        status: 200,
      };
    } else {
      return {
        error: "User Already Exists",
        status: 400,
      };
    }
  }
  return {
    error: "Please Check Email or PhoneNumber Format",
    status: 400,
  };
}

async function loginUser(data) {
  Connection.open();
  const { email, password } = data;
  const findUser = await Connection.db
    .db("SampleApplication")
    .collection("users")
    .findOne({ email: email });
  if (findUser) {
    var isCorrectPassword = await bcrypt.compare(password, findUser.password);
    var token = jwt.sign({ id: findUser._id }, process.env.SECRET, {
      expiresIn: 86400,
    });
    if (isCorrectPassword) {
      return {
        status: 200,
        login: true,
        token: token,
      };
    }
  }
  return {
    status: 404,
    error: "Please Check username or password",
  };
}

function validateEmail(email) {
  var re =
    /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(String(email).toLowerCase());
}

function validatePhoneNumber(phno) {
  var re = /^(\+\d{1,2}\s)?\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4}$/;
  return re.test(String(phno));
}

async function getUser(token) {
  Connection.open();
  var isVerify = verifyToken(token);
  if (isVerify.status == 200) var id = isVerify.decoded.id;
  else {
    return isVerify;
  }
  const findUser = await Connection.db
    .db("SampleApplication")
    .collection("users")
    .findOne({ _id: ObjectId(id) });
  delete findUser.password;
  if (findUser) {
    return {
      status: 200,
      user: findUser,
    };
  }
  return {
    status: 404,
    error: "user not found",
  };
}

async function sendMail(email, pass) {
  Email.open();
  let info = await Email.transport.sendMail({
    from: '"Arnold Eichmann" <arnold.eichmann@ethereal.email>',
    to: email,
    subject: "Your Username and Password",
    text: "Welcome to NodeSampleApplication",
    html: `<p>Your Username is ${email} and Password is ${pass}</p>`,
  });
}

module.exports = { addUsers, loginUser, getUser };
