const ChromeLauncher = require("chrome-launcher");

export const swaggerStart = async () => {
  try {
    await ChromeLauncher.launch({
      port: 9222,
      startingUrl: `http://localhost:${process.env.PORT}/api-doc/`,
    });
  } catch (error) {
    console.log(error);
  }
};
