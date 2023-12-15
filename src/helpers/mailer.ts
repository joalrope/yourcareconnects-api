//import { google } from "googleapis";
import nodemailer from "nodemailer";
import { Options } from "nodemailer/lib/mailer";
//import smtptransport from "nodemailer-smtp-transport";

export const sendEmail = async (options: Options) => {
  const user = process.env.EMAIL_ADDRESS;
  const pass = process.env.EMAIL_PASSWORD;

  const transport = nodemailer.createTransport({
    host: "smtpout.secureserver.net",
    port: 465,
    secure: true,
    requireTLS: true,
    tls: {
      ciphers: "SSLv3",
    },
    debug: true,
    auth: {
      user,
      pass,
    },
  });

  console.log("sending mail", options);
  try {
    return transport.sendMail(options, (error, response) => {
      console.log("respuesta y error", { error, response });
      transport.close();
      return error ? error : response;
    });
  } catch (error) {
    return error;
  }
};
