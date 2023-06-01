import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UserRole } from 'src/common/Enums';
import {
  AD_BASE_DN,
  AD_DOMAIN_NAME,
  AD_ROOT_PASSWORD,
  AD_ROOT_USERNAME,
  AD_URL,
  ASTMNGT_ADMIN_USERNAMES,
} from 'src/environment';
const ActiveDirectory = require('activedirectory2');

@Injectable()
export class ActiveDirectoryService {
  ad: any = null;
  constructor() {
    this.ad = new ActiveDirectory({
      url: AD_URL,
      baseDN: AD_BASE_DN,
      username: AD_ROOT_USERNAME,
      password: AD_ROOT_PASSWORD,
      attributes: {
        user: [
          'dn', 'ou', 'distinguishedName',
          'userPrincipalName', 'sAMAccountName', 'mail',
          'lockoutTime', 'whenCreated', 'pwdLastSet', 'userAccountControl',
          'employeeID', 'sn', 'givenName', 'initials', 'cn', 'displayName',
          'comment', 'description', 'isMemberOf', 'jobTitle',

          'telephoneNumber',
          'company',
          'title',
          'mobile',
          'department'
        ],
        group: [
          'dn', 'cn', 'ou', 'description', 'distinguishedName', 'objectCategory'
        ],
        objectclass: ['organization', 'top'],
      },
      includeMembership: ['group', 'user'],
    });


  }

  async authenticateUser(username: string, password: string) {
    const isCredentialValid = await this.validate(username, password);
    if (isCredentialValid) {
      return this.findUserByUsername(username);
    } else {
      throw new UnauthorizedException();
    }
  }

  async validate(username: string, password: string) {
    return await new Promise((resolve, reject) => {
      this.ad.authenticate(
        username + '@' + AD_DOMAIN_NAME,
        password,
        function (err, auth) {
          if (err) resolve(false);

          if (auth) resolve(true);
          else resolve(false);
        },
      );
    });
  }

  async findUserByUsername(username: string) {
    return await new Promise((resolve, reject) => {
      this.ad.findUser(username, function (err, user) {
        if (err || !user) {
          resolve(null);
        }

        user.role = ASTMNGT_ADMIN_USERNAMES.includes(user.sAMAccountName) ? UserRole.LEVEL2 : UserRole.LEVEL3;
        resolve(user);
      });
    });
  }

  async getAllADUsers() {
    return await new Promise((resolve, reject) => {
      this.ad.findUsers(function (err, results) {
        if (err || !results) {
          resolve([]);
        }
        resolve(results);
      });
    })
  }

  async getADUsersForDropDown() {
    let allADUsers: any = await this.getAllADUsers();
    allADUsers = allADUsers.filter((user) => user.mail);
    const adUsersForDropDown = {};
    allADUsers.forEach((user) => {
      Object.assign(adUsersForDropDown, {
        [user.sAMAccountName]: user.sAMAccountName,
      });
    });

    return { adUsersForDropDown }
  }

  async paginateUsers() {
    return await new Promise((resolve, reject) => {
      this.ad.findUsers({
        sizeLimit: 2,
        paged: true
      }, function (err, results) {
        if (err || !results) {
          resolve([]);
        }
        resolve(results);
      });
    })
  }
}
