import * as  crypto from 'crypto';

export const encode = (value: string) => {
    let encrypted: string = null;

    const secret_key = 'secret_key', secret_iv = 'secret_iv';
    const key = crypto.createHash('sha256').update(secret_key).digest('hex').substr(0, 32);
    const iv = crypto.createHash('sha256').update(secret_iv).digest('hex').substr(0, 16);
    let cipher = crypto.createCipheriv('aes-256-cbc', key, iv);
    encrypted = cipher.update(value.toString(), 'utf8', 'base64');
    encrypted += cipher.final('base64');
    encrypted = base64encode(encrypted);

    return encrypted;
};

export const decode = (value: string) => {
    let decrypted: string = null;

    const secret_key = 'secret_key', secret_iv = 'secret_iv';
    const key = crypto.createHash('sha256').update(secret_key).digest('hex').substr(0, 32);
    const iv = crypto.createHash('sha256').update(secret_iv).digest('hex').substr(0, 16);
    let decipher = crypto.createDecipheriv('aes-256-cbc', key, iv);
    decrypted = decipher.update(base64decode(value), 'base64', 'utf8');
    decrypted += decipher.final('utf8');

    return decrypted;
};

export const base64encode = (value: string) => {
    let buff = Buffer.from(value);
    let base64data = buff.toString('base64');
    return base64data;
};

export const base64decode = (value: string) => {
    let buff = Buffer.from(value, 'base64');
    let text = buff.toString('ascii');
    return text;
};