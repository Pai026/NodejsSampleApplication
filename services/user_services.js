var generator = require('generate-password')
var bcrypt = require("bcryptjs")
const nodemailer = require('nodemailer')
const { Connection } = require("../common/dbConnection");
const { Email } =require("../common/emailConfig")

async function addUsers(data) {
    Connection.open() 
    const {email,phono} = data
    const findUser = await Connection.db.db("SampleApplication").collection("users").findOne({email:email})
    if(!findUser){
        var password = generator.generate({
            length:10,
            uppercase: false
          })
        var hashedPass = await bcrypt.hash(password,10);
        const user = {
            email:email,
            phono: phono,
            userDetails: {},
            password: hashedPass
        }
        const result = await Connection.db.db("SampleApplication").collection("users").insertOne(user);
        sendMail(email,password)
        return {
            "username":email,
            "password":password,
            status:200
        }
    }
    else{
        return {
            "error":"User Already Exists",
            status:400
        }
    }
}

async function loginUser(data) {
    Connection.open() 
    const {email,password}=data
    const findUser = await Connection.db.db("SampleApplication").collection("users").findOne({email:email})
    if(findUser){
        console.log("here")
        var isCorrectPassword = await bcrypt.compare(password,findUser.password)
        if(isCorrectPassword)
        {
            return {
                status:200,
                "login":true
            }
        }
    }
    return {
        status: 404,
        "error":"Please Check username or password"
    }
}

async function sendMail(email,pass) {
    Email.open();
    let info = await Email.transport.sendMail({
        from: '"Arnold Eichmann" <arnold.eichmann@ethereal.email>',
        to: email,
        subject: "Your Username and Password",
        text: "Welcome to NodeSampleApplication",
        html: `<p>Your Username is ${email} and Password is ${pass}</p>`
    })
}

module.exports = {addUsers,loginUser}