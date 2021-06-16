var generator = require('generate-password')
var bcrypt = require("bcryptjs")
const { Connection } = require("../database/connection");
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

module.exports = {addUsers,loginUser}