import { MailerService } from '@nestjs-modules/mailer';
import ejs from 'ejs';
import { Injectable } from '@nestjs/common';
import { IEmail } from 'src/common/types/types';

@Injectable()
export class EmailService {
  constructor(private mailService: MailerService) {}

  async sendEmail({ from, subject, template, to, data }: IEmail) {
    await this.mailService.sendMail({
      from: from,
      to: to,
      subject: subject,
      html: await ejs.renderFile(template, data),
    });
  }
}
