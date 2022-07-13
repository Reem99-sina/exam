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
        //                     {
        //                         filename: 'text1.txt',
        //                         content: 'hello world!'
        //                     },
        //                     {   // binary buffer as an attachment
        //                         filename: 'text2.txt',
        //                         content: new Buffer('hello world!','utf-8')
        //                     },
        //                     {   // file on disk as an attachment
        //                         filename: 'text3.txt',
        //                         path: '/path/to/file.txt' // stream this file
        //                     },
        //                     {   // filename and content type is derived from path
        //                         path: '/path/to/file.txt'
        //                     },
        //                     {   // stream as an attachment
        //                         filename: 'text4.txt',
        //                         content: fs.createReadStream('file.txt')
        //                     },
        //                     {   // define custom content type for the attachment
        //                         filename: 'text.bin',
        //                         content: 'hello world!',
        //                         contentType: 'text/plain'
        //                     },
        //                     {   // use URL as an attachment
        //                         filename: 'license.txt',
        //                         path: 'https://raw.github.com/nodemailer/nodemailer/master/LICENSE'
        //                     },
        //                     {   // encoded string as an attachment
        //                         filename: 'text1.txt',
        //                         content: 'aGVsbG8gd29ybGQh',
        //                         encoding: 'base64'
        //                     },
        //                     {   // data uri as an attachment
        //                         path: 'data:text/plain;base64,aGVsbG8gd29ybGQ='
        //                     },
        //                     {
        //                         // use pregenerated MIME node
        //                         raw: 'Content-Type: text/plain\r\n' +
        //                              'Content-Disposition: attachment;\r\n' +
        //                              '\r\n' +
        //                              'Hello world!'
        //                     }
        //                 ],
        onError: (e) => console.log(e),
        onSuccess: (i) => console.log(i)
    }
    );
}
module.exports = sendEmail