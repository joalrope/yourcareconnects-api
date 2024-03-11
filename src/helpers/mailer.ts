//import { google } from "googleapis";
import nodemailer from "nodemailer";
import { Options } from "nodemailer/lib/mailer";
//import smtptransport from "nodemailer-smtp-transport";

export const sendEmail = async (options: Options) => {
  const user = process.env.EMAIL_ADDRESS;
  const pass = process.env.EMAIL_PASSWORD;

  const transport = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user,
      pass,
    },
  });

  try {
    return transport.sendMail(options, (error, response) => {
      if (process.env.NODE_ENV === "development") {
        console.log("respuesta y error", { error, response });
      }
      transport.close();
      return error ? error : response;
    });
  } catch (error) {
    return error;
  }
};
