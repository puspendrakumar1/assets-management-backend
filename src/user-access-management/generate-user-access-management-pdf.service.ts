import { Injectable } from '@nestjs/common';
import { renderFile } from 'ejs';
import * as fs from 'fs';
import * as moment from 'moment';
import { formateDate } from 'src/common/utils/uam';

const puppeteer = require('puppeteer');
const locateChrome = require('locate-chrome');

@Injectable()
export class GenerateUserAccessManagementPDFService {
  constructor() {
    // this.getUAMPDF();
  }
  async getUAMPDF(uam: any) {
    uam.formateDate = formateDate;
    const content = await renderFile(__dirname + '/templates/uam.ejs', {
      ...uam,
      ...uam[uam.uamType],
    });

    const executablePath = await new Promise((resolve) =>
      locateChrome((arg) => resolve(arg)),
    );
    let browser =
      process.env.NODE_ENV === 'production'
        ? await puppeteer.launch({
            args: ['--no-sandbox', '--disable-setuid-sandbox'],
            ignoreHTTPSErrors: true,
            dumpio: false,
          })
        : await puppeteer.launch({
            headless: true,
            executablePath,
          });

    const page = await browser.newPage();
    await page.setContent(content, { waitUntil: 'networkidle0' });
    const buffer = await page.pdf({
      format: 'A4',
      displayHeaderFooter: true,

      // headerTemplate: `<html>
      // <body>Testing</body>
      // </html>
      // `,
      // footerTemplate: `<html>
      // <body>Testing</body>
      // </html>
      // `,
      // margin: { top: '100px', bottom: '100px' },
      printBackground: true,
    });

    const filePath = 'public/user-access-management';
    // const fileName = `uam-${moment().format('DD-MM-YYYY-HH-mm-ss')}.pdf`;
    const fileName = 'uam.pdf';

    await new Promise((resolve, reject) => {
      fs.mkdir(filePath, function () {
        fs.writeFile(`${filePath}/${fileName}`, buffer, function (err) {
          if (err) {
            console.log('err', err);
            reject(err);
          }
          resolve('');
        });
      });
    });

    return [
      {
        filename: fileName,
        path: `${filePath}/${fileName}`,
        contentType: 'application/pdf',
      },
    ];
  }
}
