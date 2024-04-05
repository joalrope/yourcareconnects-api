//import { google } from "googleapis";
import nodemailer from "nodemailer";
import { Options } from "nodemailer/lib/mailer";
//import smtptransport from "nodemailer-smtp-transport";
import { google } from "googleapis";

export const sendEmail = async (options: Options) => {
  const clientId = process.env.CLIENT_ID;
  const clientSecret = process.env.CLIENT_SECRET;
  const user = process.env.CLIENT_USER;
  const refreshToken = process.env.REFRESH_TOKEN;

  const OAuth2 = google.auth.OAuth2;

  const oauth2Client = new OAuth2(
    clientId,
    clientSecret,
    "https://developers.google.com/oauthplayground" // Redirect URL
  );

  oauth2Client.setCredentials({
    refresh_token: refreshToken,
  });

  const smtpTransport = nodemailer.createTransport({
    service: "gmail",
    auth: {
      type: "OAuth2",
      user,
      clientId,
      clientSecret,
      refreshToken,
    },
    tls: {
      rejectUnauthorized: false,
    },
  });

  try {
    return smtpTransport.sendMail(options, (error, response) => {
      if (process.env.NODE_ENV === "development") {
        console.log({
          to: response.envelope.to,
          subject: response.envelope.from,
          html: response.accepted,
        });
        console.log("respuesta y error", { error, response });
      }
      smtpTransport.close();
      return error ? error : response;
    });
  } catch (error) {
    return error;
  }
};
