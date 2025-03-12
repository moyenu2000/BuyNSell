import crypto from 'crypto';
const passwordHash = crypto.createHash('sha1').update('12345678').digest('hex');
console.log(passwordHash)