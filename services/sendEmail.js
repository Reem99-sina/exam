var nodeoutlook = require('nodejs-nodemailer-outlook')
function sendEmail(dest, message, attachment) {
    if (!attachment) {
        attachment = []
    }
    nodeoutlook.sendEmail({
        auth: {
            user: process.env.sendEmail,
            pass: process.env.password
        },
        from: process.env.sendEmail,
        to: dest,
        subject: 'Hey you, awesome!',
        html: message,
        text: 'This is text version!',
        replyTo: 'receiverXXX@gmail.com',
        attachments: attachment,
        onError: (e) => console.log(e),
        onSuccess: (i) => console.log(i)
    }
    );
}
module.exports = sendEmail