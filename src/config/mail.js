export default {
  host: process.env.MAIL_HOST,
  port: process.env.MAIL_PORT,
  secure: process.env.MAIL_SECURE === 'true',
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS,
  },
  tls: {
    rejectUnauthorized: process.env.MAIL_SECURE === 'true',
  },
  default: {
    from: process.env.MAIL_FROM,
  },
};

/**
 * serviços de email
 * amazon ses
 * mailgun
 * sparkpost
 * mandril (só funciona com mailshiping)
 * mailtrap (só para ambiente de desenv) */
