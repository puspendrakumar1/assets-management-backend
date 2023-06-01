import { Injectable } from '@nestjs/common';
import { Transporter, createTransport } from 'nodemailer';
import Mail from 'nodemailer/lib/mailer';
import SMTPTransport from 'nodemailer/lib/smtp-transport';

import { NODEMAILER_EMAIL, NODEMAILER_PASSWORD } from 'src/environment';

@Injectable()
export class NodemailerService {
  transporter: Transporter<SMTPTransport.SentMessageInfo>;

  constructor() {
    this.transporter = createTransport({
      host: 'smtp.gmail.com',
      port: 587,
      secure: false, // use SSL
      auth: {
        user: NODEMAILER_EMAIL,
        pass: NODEMAILER_PASSWORD,
      },
    });
  }

  async sendEmail(mailOptions: Mail.Options) {
    if (NODEMAILER_EMAIL && NODEMAILER_PASSWORD) {
      this.transporter.sendMail(
        {
          from: '"Rikiel Assets Management" badal.khatri0924@gmail.com',
          ...mailOptions,
        },
        function (err, info) {
          if (err) {
            console.log(err);
          } else {
            console.log('Message sent: ' + info.response);
          }
        },
      );
    }
  }
}
