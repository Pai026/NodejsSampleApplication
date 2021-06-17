const nodemailer = require('nodemailer')

class Email {
    static async open() {
        if(this.transport) return this.transport;
        this.transport = nodemailer.createTransport({
            host: 'smtp.ethereal.email',
            port: 587,
            auth: {
                user: 'arnold.eichmann@ethereal.email',
                pass: 'he1KFcHP6phgKXPGza'
            }
        });
        return this.transport;
    }
}

Email.transport = null;

module.exports = { Email }