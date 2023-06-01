import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
  Query,
  Render,
  UseGuards,
} from '@nestjs/common';
import { renderFile } from 'ejs';
import * as fs from 'fs';
import { CurrentUser } from 'src/common/Decorators/current-user.decorator';
import { Permissions } from 'src/common/Decorators/permissions.decorator';
import { Roles } from 'src/common/Decorators/role.decorator';
import { UserPermissions, UserRole } from 'src/common/Enums';
import { JwtAuthGuard } from 'src/common/Guards/jwt-auth.guard';
import { PermissionGuard } from 'src/common/Guards/premission.guard';
import { RolesGuard } from 'src/common/Guards/roles.guards';
import { IdDto } from 'src/dtos/id.dto';
import { UserDocument } from 'src/users/schemas/user.schema';
import { CloseUAMDTO } from './dtos/close-uam.dto';
import { CreateUAMDTO } from './dtos/create-uam-dto';
import { AssignUAMNumberDTO } from './dtos/create-uam-numbe.dto';
import { RejectUAMDTO } from './dtos/reject-uam.dto';
import { PaginateUserAccessManagementService } from './user-access-management-paginate.service';
import { UserAccessManagementService } from './user-access-management.service';

const puppeteer = require('puppeteer');
const locateChrome = require('locate-chrome');

@UseGuards(JwtAuthGuard, RolesGuard, PermissionGuard)
@Controller('user-access-management')
export class UserAccessManagementController {
  constructor(
    private readonly userAccessManagementService: UserAccessManagementService,
    private readonly paginateUserAccessManagementService: PaginateUserAccessManagementService,
  ) {}

  @Get()
  @Render('uam')
  async root() {
    // const content = await renderFile(__dirname + '/templates/uam.ejs', {});

    // const executablePath = await new Promise((resolve) =>
    //   locateChrome((arg) => resolve(arg)),
    // );
    // let browser =
    //   process.env.NODE_ENV === 'production'
    //     ? await puppeteer.launch({
    //         args: ['--no-sandbox', '--disable-setuid-sandbox'],
    //         ignoreHTTPSErrors: true,
    //         dumpio: false,
    //       })
    //     : await puppeteer.launch({
    //         headless: true,
    //         executablePath,
    //       });

    // const page = await browser.newPage();
    // await page.setContent(content, { waitUntil: 'networkidle0' });
    // const buffer = await page.pdf({
    //   format: 'A4',
    //   displayHeaderFooter: true,

    //   // margin: { top: '10px', bottom: '10px' },
    //   printBackground: true,
    //   // path: '/desktop/test.pdf',
    // });

    // await new Promise((resolve, reject) => {
    //   fs.mkdir('public', function () {
    //     fs.writeFile('public/uam-form.pdf', buffer, function (err) {
    //       if (err) {
    //         console.log('err', err);
    //         reject(err);
    //       }
    //       resolve('');
    //     });
    //   });
    // });

    return { message: 'Hello world!' };
  }

  @Post()
  @Roles(UserRole.LEVEL1, UserRole.LEVEL2, UserRole.LEVEL3)
  @Permissions(UserPermissions.UAMCreate)
  async createUAM(
    @Body() uam: CreateUAMDTO,
    @CurrentUser() currentUser: UserDocument,
  ) {
    return this.userAccessManagementService.createUserAccessManagement(
      uam,
      currentUser,
    );
  }

  @Put(':id')
  @Roles(UserRole.LEVEL1, UserRole.LEVEL2, UserRole.LEVEL3)
  @Permissions(UserPermissions.UAMUpdate)
  async updateUAM(
    @Param() idDto: IdDto,
    @Body() uam: CreateUAMDTO,
    @CurrentUser() currentUser: UserDocument,
  ) {
    return this.userAccessManagementService.updateUAM(
      idDto.id,
      uam,
      currentUser,
    );
  }

  @Put('assign-uam-number/:id')
  @Roles(UserRole.LEVEL1, UserRole.LEVEL2, UserRole.LEVEL3)
  @Permissions(UserPermissions.UAMNoCreate)
  async assignUAMNumber(
    @Param() idDto: IdDto,
    @Body() assignUAMNumberDTO: AssignUAMNumberDTO,
    @CurrentUser() currentUser: UserDocument,
  ) {
    return this.userAccessManagementService.assignUAMNumber(
      idDto.id,
      assignUAMNumberDTO.uamNumber,
      currentUser,
    );
  }

  @Put('approval-from-line-manager/:id')
  @Roles(UserRole.LEVEL1, UserRole.LEVEL2, UserRole.LEVEL3)
  @Permissions(UserPermissions.UAMUpdate)
  async approvalFromLineManager(
    @Param() idDto: IdDto,
    @CurrentUser() currentUser: UserDocument,
  ) {
    return this.userAccessManagementService.approvalFromLineManager(
      idDto.id,
      currentUser,
    );
  }

  @Put('close-uam/:id')
  @Roles(UserRole.LEVEL1, UserRole.LEVEL2, UserRole.LEVEL3)
  @Permissions(UserPermissions.UAMUpdate)
  async closeUAM(
    @Param() idDto: IdDto,
    @CurrentUser() currentUser: UserDocument,
    @Body() closeUAMDTO: CloseUAMDTO,
  ) {
    return this.userAccessManagementService.closeUAM(
      idDto.id,
      closeUAMDTO,
      currentUser,
    );
  }

  @Put('reject-uam/:id')
  @Roles(UserRole.LEVEL1, UserRole.LEVEL2, UserRole.LEVEL3)
  @Permissions(UserPermissions.UAMUpdate)
  async rejectUAM(
    @Param() idDto: IdDto,
    @CurrentUser() currentUser: UserDocument,
    @Body() rejectUAMDTO: RejectUAMDTO,
  ) {
    return this.userAccessManagementService.rejectUAM(
      idDto.id,
      rejectUAMDTO,
      currentUser,
    );
  }

  @Get('paginate')
  @Roles(UserRole.LEVEL1, UserRole.LEVEL2, UserRole.LEVEL3)
  @Permissions(UserPermissions.UAMView)
  async paginate(
    @Query() query: any,
    @CurrentUser() currentUser: UserDocument,
  ) {
    return this.paginateUserAccessManagementService.paginate(
      query,
      currentUser,
    );
  }

  @Get(':id')
  @Roles(UserRole.LEVEL1, UserRole.LEVEL2, UserRole.LEVEL3)
  @Permissions(UserPermissions.UAMView)
  async getUAMById(
    @Param() idDto: IdDto,
    @CurrentUser() currentUser: UserDocument,
  ) {
    return {
      data: await this.userAccessManagementService.getUAMById(
        idDto.id,
        currentUser,
      ),
    };
  }
}
