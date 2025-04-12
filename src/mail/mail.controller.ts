import { Controller, Post, Body } from '@nestjs/common';
import { MailService } from './mail.service';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { Public } from '@common/decorators';

@ApiTags('mail')
@Controller('mail')
export class MailController {
  constructor(private readonly mailService: MailService) {}

  @Public()
  @Post('contact')
  @ApiOperation({ summary: 'Отправить сообщение из формы контактов' })
  async sendContactForm(
    @Body()
    contactData: {
      name: string;
      email: string;
      subject?: string;
      message: string;
    },
  ) {
    return this.mailService.sendContactForm(contactData);
  }
}
