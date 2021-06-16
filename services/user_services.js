var generator = require('generate-password')
var bcrypt = require("bcryptjs")
const { Connection } = require("../database/connection");
Connection.open() 
async function addUsers(data) {
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
module.exports = {addUsers}