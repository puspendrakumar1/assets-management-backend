import { Body, Controller, Get, Post, Render, Res } from '@nestjs/common';
import { Response } from 'express';
import { join, resolve } from 'path';
import * as fs from 'fs';

const puppeteer = require('puppeteer');
const locateChrome = require('locate-chrome');
let ejs = require('ejs');

@Controller('allocation-form')
export class AllocationFormController {
  @Post()
  async generateAllocationForm(@Body() data: any) {
    const logo = `data:image;base64,${`iVBORw0KGgoAAAANSUhEUgAAArwAAADdCAYAAABZjaGVAAAACXBIWXMAAAsTAAALEwEAmpwYAAAG0mlUWHRYTUw6Y29tLmFkb2JlLnhtcAAAAAAAPD94cGFja2V0IGJlZ2luPSLvu78iIGlkPSJXNU0wTXBDZWhpSHpyZVN6TlRjemtjOWQiPz4gPHg6eG1wbWV0YSB4bWxuczp4PSJhZG9iZTpuczptZXRhLyIgeDp4bXB0az0iQWRvYmUgWE1QIENvcmUgNS42LWMxNDUgNzkuMTYzNDk5LCAyMDE4LzA4LzEzLTE2OjQwOjIyICAgICAgICAiPiA8cmRmOlJERiB4bWxuczpyZGY9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkvMDIvMjItcmRmLXN5bnRheC1ucyMiPiA8cmRmOkRlc2NyaXB0aW9uIHJkZjphYm91dD0iIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtbG5zOnhtcE1NPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvbW0vIiB4bWxuczpzdFJlZj0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL3NUeXBlL1Jlc291cmNlUmVmIyIgeG1sbnM6c3RFdnQ9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZUV2ZW50IyIgeG1sbnM6ZGM9Imh0dHA6Ly9wdXJsLm9yZy9kYy9lbGVtZW50cy8xLjEvIiB4bWxuczpwaG90b3Nob3A9Imh0dHA6Ly9ucy5hZG9iZS5jb20vcGhvdG9zaG9wLzEuMC8iIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIDIwMTQgKE1hY2ludG9zaCkiIHhtcDpDcmVhdGVEYXRlPSIyMDIwLTA3LTIyVDEzOjU0OjM1KzA1OjMwIiB4bXA6TW9kaWZ5RGF0ZT0iMjAyMC0wNy0yMlQxMzo1NzowMyswNTozMCIgeG1wOk1ldGFkYXRhRGF0ZT0iMjAyMC0wNy0yMlQxMzo1NzowMyswNTozMCIgeG1wTU06SW5zdGFuY2VJRD0ieG1wLmlpZDoyNTQxNzkwNy04NjkxLTJiNDktYTIyNi1mZWIzMzRiMzVlN2YiIHhtcE1NOkRvY3VtZW50SUQ9ImFkb2JlOmRvY2lkOnBob3Rvc2hvcDplNjIyNjk5Yy0xZDUxLTY5NDQtYWIzMy1iOWI5YjlmYWZjNTMiIHhtcE1NOk9yaWdpbmFsRG9jdW1lbnRJRD0ieG1wLmRpZDoyMjM5MkJEMEZEQjAxMUU0QUVCRUUzQTg5NkU5QUNEQyIgZGM6Zm9ybWF0PSJpbWFnZS9wbmciIHBob3Rvc2hvcDpDb2xvck1vZGU9IjMiIHBob3Rvc2hvcDpJQ0NQcm9maWxlPSJzUkdCIElFQzYxOTY2LTIuMSI+IDx4bXBNTTpEZXJpdmVkRnJvbSBzdFJlZjppbnN0YW5jZUlEPSJ4bXAuaWlkOjIyMzkyQkNERkRCMDExRTRBRUJFRTNBODk2RTlBQ0RDIiBzdFJlZjpkb2N1bWVudElEPSJ4bXAuZGlkOjIyMzkyQkNFRkRCMDExRTRBRUJFRTNBODk2RTlBQ0RDIi8+IDx4bXBNTTpIaXN0b3J5PiA8cmRmOlNlcT4gPHJkZjpsaSBzdEV2dDphY3Rpb249InNhdmVkIiBzdEV2dDppbnN0YW5jZUlEPSJ4bXAuaWlkOmJiNDAyZGI3LWFlYTEtODg0NC1hOThkLWI5NjllNTQ3MDE0MyIgc3RFdnQ6d2hlbj0iMjAyMC0wNy0yMlQxMzo1NzowMyswNTozMCIgc3RFdnQ6c29mdHdhcmVBZ2VudD0iQWRvYmUgUGhvdG9zaG9wIENDIDIwMTkgKFdpbmRvd3MpIiBzdEV2dDpjaGFuZ2VkPSIvIi8+IDxyZGY6bGkgc3RFdnQ6YWN0aW9uPSJzYXZlZCIgc3RFdnQ6aW5zdGFuY2VJRD0ieG1wLmlpZDoyNTQxNzkwNy04NjkxLTJiNDktYTIyNi1mZWIzMzRiMzVlN2YiIHN0RXZ0OndoZW49IjIwMjAtMDctMjJUMTM6NTc6MDMrMDU6MzAiIHN0RXZ0OnNvZnR3YXJlQWdlbnQ9IkFkb2JlIFBob3Rvc2hvcCBDQyAyMDE5IChXaW5kb3dzKSIgc3RFdnQ6Y2hhbmdlZD0iLyIvPiA8L3JkZjpTZXE+IDwveG1wTU06SGlzdG9yeT4gPC9yZGY6RGVzY3JpcHRpb24+IDwvcmRmOlJERj4gPC94OnhtcG1ldGE+IDw/eHBhY2tldCBl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`}`;
    // const allocationFormData = {
    //   laptopConfigurationChecklist: {
    //     hostName: 'APC',
    //     keyboard: false,
    //     assetSerialNo: 'ASD',
    //     mouse: true,
    //     assetModelNo: 'm1',
    //     headphone: true,
    //     userId: 'u1',
    //     additionalTFT: false,
    //     assetAllocationDate: '08 November 2021',
    //     location: {
    //       ahmedabad: true,
    //       delhi: false,
    //     },
    //     assetAllocationType: {
    //       new: false,
    //       replacement: true,
    //     },
    //     handoverType: {
    //       courier: true,
    //       userPickupFromOffice: false,
    //     },
    //   },
    //   systemChecklistActivities: [
    //     true,
    //     false,
    //     true,
    //     false,
    //     true,
    //     false,
    //     true,
    //     false,
    //     true,
    //     false,
    //     true,
    //     false,
    //     true,
    //     false,
    //     true,
    //     false,
    //     true,
    //     false,
    //     true,
    //     false,
    //     true,
    //     false,
    //     true,
    //     false,
    //   ],
    //   businessUserAcknowledgement: {
    //     userName: 'VishalW',
    //     userSignatureDate: '08/Nov/2021',
    //   },
    //   itEngineer: {
    //     engineerName: 'Altaf Mansuri',
    //   },
    // };

    const allocationFormData: any = this.generateFormateData(data);
    // const buffer = await this.invoicesService.generatePDF();
    // return
    const content = `<!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <meta http-equiv="X-UA-Compatible" content="IE=edge" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Document</title>
        <style>
          body {
            padding: 20px;
            font-size: 14px
          }
          table {
            text-align: left;
            border-collapse: collapse;
            margin: 10px 0;
            font-family: roboto;
          }
          .row-numbering {
            width: 3%;
          }
          .system-checklist-activities-detail {
            width: 61.5%;
          }
          .table-border {
            border: 1px solid black;
          }
          th,
          td {
            padding: 2.5px 5px;
            font-family: roboto;
          }
          .text-center {
            text-align: center;
          }
          .img {
            -webkit-filter:invert(100%);
          }
        }
        </style>
      </head>
      <body>
          
          <img class="img" style="width: 150px; height: 50px" src="${logo}" alt="Apcer Life Science">
          
        <table style="width: 100%" cellpadding="0" cellspacing="0">
          <tr>
            <th class="text-center table-border" colspan="4">
              Laptop Configuration Checklist
            </th>
          </tr>
          <tr class="align-left">
            <th class="table-border">Host Name</th>
            <td class="table-border">${
              allocationFormData.laptopConfigurationChecklist.hostname
            }</td>
            <th class="table-border">Keyboard</th>
            <td class="table-border">
              <input type="checkbox" ${
                allocationFormData.laptopConfigurationChecklist.keyboard
                  ? 'checked'
                  : ''
              } /> Yes <input type="checkbox" ${
      !allocationFormData.laptopConfigurationChecklist.keyboard ? 'checked' : ''
    } /> No
            </td>
          </tr>
          <tr>
            <th class="table-border">Asset Serial No.</th>
            <td class="table-border">${
              allocationFormData.laptopConfigurationChecklist.assetSerialNo
            }</td>
            <th class="table-border">Mouse</th>
            <td class="table-border">
            <input type="checkbox" ${
              allocationFormData.laptopConfigurationChecklist.mouse
                ? 'checked'
                : ''
            } /> Yes <input type="checkbox" ${
      !allocationFormData.laptopConfigurationChecklist.mouse ? 'checked' : ''
    } /> No
            </td>
          </tr>
          <tr>
            <th class="table-border">Asset Model No.</th>
            <td class="table-border">${
              allocationFormData.laptopConfigurationChecklist.assetModelNo
            }</td>
            <th class="table-border">Headphone</th>
            <td class="table-border">
            <input type="checkbox" ${
              allocationFormData.laptopConfigurationChecklist.headphone
                ? 'checked'
                : ''
            } /> Yes <input type="checkbox" ${
      !allocationFormData.laptopConfigurationChecklist.headphone
        ? 'checked'
        : ''
    } /> No
            </td>
          </tr>
          <tr>
            <th class="table-border">User ID</th>
            <td class="table-border">${
              allocationFormData.laptopConfigurationChecklist.userId
            }</td>
            <th class="table-border">Additional TFT</th>
            <td class="table-border">
            <input type="checkbox" ${
              allocationFormData.laptopConfigurationChecklist.additionalTFT
                ? 'checked'
                : ''
            } /> Yes <input type="checkbox" ${
      !allocationFormData.laptopConfigurationChecklist.additionalTFT
        ? 'checked'
        : ''
    } /> No
            </td>
          </tr>
          <tr>
            <th class="table-border">Asset Allocation Date</th>
            <td class="table-border">${
              allocationFormData.laptopConfigurationChecklist
                .assetAllocationDate
            }</td>
            <th class="table-border">Location</th>
            <td class="table-border">
            <input type="checkbox" ${
              allocationFormData.laptopConfigurationChecklist.location.delhi
                ? 'checked'
                : ''
            } /> Delhi <input type="checkbox" ${
      allocationFormData.laptopConfigurationChecklist.location.ahmedabad
        ? 'checked'
        : ''
    } /> Ahmedabad
            </td>
          </tr>
          <tr>
            <th class="table-border">Asset Allocation Type</th>
            <td class="table-border">
            <input type="checkbox" ${
              allocationFormData.laptopConfigurationChecklist
                .assetAllocationType.new
                ? 'checked'
                : ''
            } /> New Asset <input type="checkbox" ${
      allocationFormData.laptopConfigurationChecklist.assetAllocationType
        .replacement
        ? 'checked'
        : ''
    } /> Replacement
              
            </td>
            <th class="table-border">Handover Type</th>
            <td class="table-border">

            <input type="checkbox" ${
              allocationFormData.laptopConfigurationChecklist.handoverType
                .courier
                ? 'checked'
                : ''
            } /> Courier <input type="checkbox" ${
      allocationFormData.laptopConfigurationChecklist.handoverType
        .userPickupFromOffice
        ? 'checked'
        : ''
    } /> User Pickup from Office
              
            </td>
          </tr>
        </table>
    
        <table style="width: 100%" cellpadding="0" cellspacing="0">
          <tr>
            <th class="text-center table-border" colspan="4">
              System Checklist Activities
            </th>
          </tr>
          <tr>
            <th class="row-numbering table-border">1.</th>
            <td class="system-checklist-activities-detail table-border">
              Operating System installation-Windows 10 Professional
            </td>
            <td class="table-border">
              <input type="checkbox" ${
                allocationFormData.systemChecklistActivities[0] ? 'checked' : ''
              } /> Yes <input type="checkbox" ${
      !allocationFormData.systemChecklistActivities[0] ? 'checked' : ''
    } /> No
            </td>
          </tr>
          <tr>
            <th class="table-border">2.</th>
            <td class="table-border">
              Antivinus and Manage Engine agent installed
            </td>
            <td class="table-border">
            <input type="checkbox" ${
              allocationFormData.systemChecklistActivities[1] ? 'checked' : ''
            } /> Yes <input type="checkbox" ${
      !allocationFormData.systemChecklistActivities[1] ? 'checked' : ''
    } /> No
            </td>
          </tr>
          <tr>
            <th class="table-border">2.A</th>
            <td class="table-border">
              Machine registered successfully on respective Antivirus and Manage
              Engine
            </td>
            <td class="table-border">
            <input type="checkbox" ${
              allocationFormData.systemChecklistActivities[2] ? 'checked' : ''
            } /> Yes <input type="checkbox" ${
      !allocationFormData.systemChecklistActivities[2] ? 'checked' : ''
    } /> No
            </td>
          </tr>
          <tr>
            <th class="table-border">3</th>
            <td class="table-border">Domain User id created</td>
            <td class="table-border">
            <input type="checkbox" ${
              allocationFormData.systemChecklistActivities[3] ? 'checked' : ''
            } /> Yes <input type="checkbox" ${
      !allocationFormData.systemChecklistActivities[3] ? 'checked' : ''
    } /> No
            </td>
          </tr>
          <tr>
            <th class="table-border">4</th>
            <td class="table-border">Machine is added to "apouk Incal Domain</td>
            <td class="table-border">
            <input type="checkbox" ${
              allocationFormData.systemChecklistActivities[4] ? 'checked' : ''
            } /> Yes <input type="checkbox" ${
      !allocationFormData.systemChecklistActivities[4] ? 'checked' : ''
    } /> No
            </td>
          </tr>
          <tr>
            <th class="table-border">4.A</th>
            <td class="table-border">
              Managed via Active Directory viz. USB Disable (read only), APCER
              Password Policy, No Admin Access, Password Change an Next Login etc.
            </td>
            <td class="table-border">
            <input type="checkbox" ${
              allocationFormData.systemChecklistActivities[5] ? 'checked' : ''
            } /> Yes <input type="checkbox" ${
      !allocationFormData.systemChecklistActivities[5] ? 'checked' : ''
    } /> No
            </td>
          </tr>
          <tr>
            <th class="table-border">5</th>
            <td class="table-border">Wi-Fi access</td>
            <td class="table-border">
            <input type="checkbox" ${
              allocationFormData.systemChecklistActivities[6] ? 'checked' : ''
            } /> Yes <input type="checkbox" ${
      !allocationFormData.systemChecklistActivities[6] ? 'checked' : ''
    } /> No
            </td>
          </tr>
          <tr>
            <th class="table-border">6</th>
            <td class="table-border">User profile configuration Done</td>
            <td class="table-border">
            <input type="checkbox" ${
              allocationFormData.systemChecklistActivities[7] ? 'checked' : ''
            } /> Yes <input type="checkbox" ${
      !allocationFormData.systemChecklistActivities[7] ? 'checked' : ''
    } /> No
            </td>
          </tr>
          <tr>
            <th class="table-border">6.A</th>
            <td class="table-border">External email popup for outlook profile</td>
            <td class="table-border">
            <input type="checkbox" ${
              allocationFormData.systemChecklistActivities[8] ? 'checked' : ''
            } /> Yes <input type="checkbox" ${
      !allocationFormData.systemChecklistActivities[8] ? 'checked' : ''
    } /> No
            </td>
          </tr>
          <tr>
            <th class="table-border">6.B</th>
            <td class="table-border">OneDrive Sync for non-GxP data</td>
            <td class="table-border">
            <input type="checkbox" ${
              allocationFormData.systemChecklistActivities[9] ? 'checked' : ''
            } /> Yes <input type="checkbox" ${
      !allocationFormData.systemChecklistActivities[9] ? 'checked' : ''
    } /> No
            </td>
          </tr>
          <tr>
            <th class="table-border">6.C</th>
            <td class="table-border">Productivity software/toals installed</td>
            <td class="table-border">
            <input type="checkbox" ${
              allocationFormData.systemChecklistActivities[10] ? 'checked' : ''
            } /> Yes <input type="checkbox" ${
      !allocationFormData.systemChecklistActivities[10] ? 'checked' : ''
    } /> No
            </td>
          </tr>
          <tr>
            <th class="table-border">7</th>
            <td class="table-border">
              MS office, 7zip, Outlook, Adobe Reader, VNC, Manage Engine Agent,
              TEAMS Desktop software, VPN installation License software installed if
              any with approval Le. Nuance PDF, Acrobat 7Professional etc. (Approval
              mail and License key required)
            </td>
            <td class="table-border">
            <input type="checkbox" ${
              allocationFormData.systemChecklistActivities[11] ? 'checked' : ''
            } /> Yes <input type="checkbox" ${
      !allocationFormData.systemChecklistActivities[11] ? 'checked' : ''
    } /> No
            </td>
          </tr>
          <tr>
            <th class="table-border">7.A</th>
            <td class="table-border">Asset Register Updated</td>
            <td class="table-border">
            <input type="checkbox" ${
              allocationFormData.systemChecklistActivities[12] ? 'checked' : ''
            } /> Yes <input type="checkbox" ${
      !allocationFormData.systemChecklistActivities[12] ? 'checked' : ''
    } /> No
            </td>
          </tr>
          <tr>
            <th class="table-border">7.B</th>
            <td class="table-border">
              Printer installation complete. Printer Passcode shared with User
            </td>
            <td class="table-border">
            <input type="checkbox" ${
              allocationFormData.systemChecklistActivities[13] ? 'checked' : ''
            } /> Yes <input type="checkbox" ${
      !allocationFormData.systemChecklistActivities[13] ? 'checked' : ''
    } /> No
            </td>
          </tr>
          <tr>
            <th class="table-border">9</th>
            <td class="table-border">Multi Factor Authentication configuration</td>
            <td class="table-border">
            <input type="checkbox" ${
              allocationFormData.systemChecklistActivities[14] ? 'checked' : ''
            } /> Yes <input type="checkbox" ${
      !allocationFormData.systemChecklistActivities[14] ? 'checked' : ''
    } /> No
            </td>
          </tr>
          <tr>
            <th class="table-border">10</th>
            <td class="table-border">Is Laptop physically damaged?</td>
            <td class="table-border">
            <input type="checkbox" ${
              allocationFormData.systemChecklistActivities[15] ? 'checked' : ''
            } /> Yes <input type="checkbox" ${
      !allocationFormData.systemChecklistActivities[15] ? 'checked' : ''
    } /> No
            </td>
          </tr>
          <tr>
            <th class="table-border">11</th>
            <td class="table-border">Laptop battery backup checked?</td>
            <td class="table-border">
            <input type="checkbox" ${
              allocationFormData.systemChecklistActivities[16] ? 'checked' : ''
            } /> Yes <input type="checkbox" ${
      !allocationFormData.systemChecklistActivities[16] ? 'checked' : ''
    } /> No
            </td>
          </tr>
          <tr>
            <th class="table-border">12</th>
            <td class="table-border">
              Justification required (Where selected "No"):
            </td>
            <td class="table-border">
            <input type="checkbox" ${
              allocationFormData.systemChecklistActivities[17] ? 'checked' : ''
            } /> Yes <input type="checkbox" ${
      !allocationFormData.systemChecklistActivities[17] ? 'checked' : ''
    } /> No
            </td>
          </tr>
    
          <tr>
            <td class="table-border" colspan="4">
              After reading above, User acknowledges to understand that: User is
              responsible for protection of company asset/s and data (personal and
              customer data on them. Any GxP data or Confidential/sensitive customer
              data, will be saved/stored on cilent specific folder/s on file server
              as per in place APCER Quality Policies and Procedures or timely
              advises communicated by the Quality and Compilance team User will
              strictly adhere to laid down policies and procedures related to
              organization data privacy and data protection and/or timely advises
              from IT/Quality department to deal with any security related issues or
              matter.
            </td>
          </tr>
        </table>
    
        <table style="width: 100%" cellpadding="0" cellspacing="0">
          <tr>
            <td class="table-border">
              <table style="width: 100%" cellpadding="0" cellspacing="0">
                <tr>
                  <th class="text-center" colspan="2">
                    Business User Acknowledgement
                  </th>
                </tr>
                <tr>
                  <td>User Name</td>
                  <td>${
                    allocationFormData.businessUserAcknowledgement.userName
                  }</td>
                </tr>
                <tr>
                  <td>User Signature Date</td>
                  <td>${
                    allocationFormData.businessUserAcknowledgement
                      .userSignatureDate
                  }</td>
                </tr>
              </table>
            </td>
            <td class="table-border">
              <table style="width: 100%" cellpadding="0" cellspacing="0">
                <tr>
                  <th class="text-center" colspan="2">IT Engineer</th>
                </tr>
                <tr>
                  <td>Engineer Name</td>
                  <td>${allocationFormData.itEngineer.engineerName}</td>
                </tr>
                <tr>
                  <td>Sign & Date</td>
                  <td></td>
                </tr>
              </table>
            </td>
          </tr>
          <tr>
                  <td>ANEX/POL-IT-003/001-V1</td>
                  <td>Confidential Proprietary Information - APCER Life Sciences</td>
          </tr>
        </table>
      </body>
    </html>
    `;

    // const data = await ejs.renderFile(
    //   resolve(__dirname, '../views/', 'report.ejs'),
    //   {},
    // );

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

      // margin: { top: '10px', bottom: '10px' },
      printBackground: true,
      // path: '/desktop/test.pdf',
    });

    await new Promise((resolve, reject) => {
      fs.mkdir('public', function () {
        fs.writeFile('public/allocation-form.pdf', buffer, function (err) {
          if (err) {
            console.log('err', err);
            reject(err);
          }
          resolve('');
        });
      });
    });

    // res.set({
    //   // pdf
    //   'Content-Type': 'application/pdf',
    //   'Content-Disposition': 'attachment; filename=invoice.pdf',
    //   'Content-Length': buffer.length,

    //   // prevent cache
    //   'Cache-Control': 'no-cache, no-store, must-revalidate',
    //   Pragma: 'no-cache',
    //   Expires: 0,
    //   responseType: 'arraybuffer',
    // });

    // res.end(buffer);
  }

  generateFormateData(data: any) {
    const response = {
      laptopConfigurationChecklist: {},
      systemChecklistActivities: [],
      businessUserAcknowledgement: {},
      itEngineer: {},
    };

    Object.keys(data.laptopConfigCheckpoint).forEach((key) => {
      response.laptopConfigurationChecklist[key] =
        data.laptopConfigCheckpoint[key] === 'yes'
          ? true
          : data.laptopConfigCheckpoint[key] === 'no'
          ? false
          : key === 'location' &&
            data.laptopConfigCheckpoint[key] === 'ahmedabad'
          ? { ahmedabad: true, delhi: false }
          : key === 'location' && data.laptopConfigCheckpoint[key] === 'delhi'
          ? { ahmedabad: false, delhi: true }
          : key === 'handoverType' &&
            data.laptopConfigCheckpoint[key] === 'courier'
          ? { courier: true, userPickupFromOffice: false }
          : key === 'handoverType' &&
            data.laptopConfigCheckpoint[key] === 'userPickupFromOffice'
          ? { courier: false, userPickupFromOffice: true }
          : key === 'assetAllocationType' &&
            data.laptopConfigCheckpoint[key] === 'replacement'
          ? { replacement: true, new: false }
          : key === 'assetAllocationType' &&
            data.laptopConfigCheckpoint[key] === 'new'
          ? { replacement: false, new: true }
          : data.laptopConfigCheckpoint[key];
    });

    data.systemChecklistActivity.forEach((elm: string) => {
      response.systemChecklistActivities.push(elm === 'yes' ? true : false);
    });

    Object.keys(data.businessUserAcknowledgement).forEach((key) => {
      response.businessUserAcknowledgement[key] =
        data.businessUserAcknowledgement[key] === 'yes'
          ? true
          : data.businessUserAcknowledgement[key] === 'no'
          ? false
          : data.businessUserAcknowledgement[key];
    });

    Object.keys(data.itEngineer).forEach((key) => {
      response.itEngineer[key] =
        data.itEngineer[key] === 'yes'
          ? true
          : data.itEngineer[key] === 'no'
          ? false
          : data.itEngineer[key];
    });

    return response;
  }
}
