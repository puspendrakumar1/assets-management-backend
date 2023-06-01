export interface IActiveDirectoryUser {
    dn?: string,
    distinguishedName?: string,
    userPrincipalName?: string,
    sAMAccountName?: string,
    mail?: string,
    whenCreated?: string,
    pwdLastSet?: string,
    userAccountControl?: string,
    sn?: string,
    givenName?: string,
    cn?: string,
    displayName?: string,
    description?: string,
    telephoneNumber?: string,
    company?: string,
    title?: string,
    mobile?: string,
    department?: string,
    role?: string
}

export class ActiveDirectoryUser {
    dn?: string;
    distinguishedName?: string;
    userPrincipalName?: string;
    sAMAccountName?: string;
    mail?: string;
    whenCreated?: string;
    pwdLastSet?: string;
    userAccountControl?: string;
    sn?: string;
    givenName?: string;
    cn?: string;
    displayName?: string;
    description?: string;
    telephoneNumber?: string;
    company?: string;
    title?: string;
    mobile?: string;
    department?: string;
    role?: string;
}