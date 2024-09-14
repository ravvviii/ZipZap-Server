import AdminJSFastify from "@adminjs/fastify";
import * as AdminJSMongoose from '@adminjs/mongoose';
import { dark, light, noSidebar } from '@adminjs/themes';
import AdminJS from "adminjs";
import * as Models from '../models/index.js';
import { COOKIE_PASSWORD, authenticate, sessionStore } from "./config.js";

AdminJS.registerAdapter(AdminJSMongoose)


export const admin = new AdminJS({
    resources: [
        {
            resource: Models.Customer, // Correct usage
            options: {
                listProperties: ["phone", "role", "isActivated"],
                filterProperties: ["phone", "role"],
            },
        },
        {
            resource: Models.DeliveryPartner, // Correct usage
            options: {
                listProperties: ["email", "role", "isActivated"],
                filterProperties: ["email", "role"],
            },
        },
        {
            resource: Models.Admin, // Correct usage
            options: {
                listProperties: ["email", "role", "isActivated"],
                filterProperties: ["email", "role"],
            },
        },
        { resource: Models.Branch, },
        { resource: Models.Product, },
        { resource: Models.Category, },
        { resource: Models.Order, },
        { resource: Models.Counter, },
    ],
    branding: {
        companyName: "ZipZap",
        withMadeWithLove: false,
        favicon:"https://res.cloudinary.com/dmkibqhhm/image/upload/v1726144418/ZipZap/jre48lon81thbjrermnh.jpg",
        logo:"https://res.cloudinary.com/dmkibqhhm/image/upload/v1726144418/ZipZap/jre48lon81thbjrermnh.jpg"
    },
    defaultTheme:dark.id,
    availableThemes:[dark ,light, noSidebar],
    rootPath: '/admin'
});

export const buildAdminRouter = async (app) => {
    await AdminJSFastify.buildAuthenticatedRouter(
      admin,
      { 
        authenticate,
        cookiePassword: COOKIE_PASSWORD,
        cookieName: "adminjs",
      },
      app,
      {
        store: sessionStore,
        saveUninitialized: true,
        secret: COOKIE_PASSWORD,
        cookie: {
          httpOnly: process.env.NODE_ENV === "production",
          secure: process.env.NODE_ENV === "production",
        },
      }
    );
  };
  