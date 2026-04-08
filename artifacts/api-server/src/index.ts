import app from "./app";
import { logger } from "./lib/logger";
import { seedIfEmpty } from "@workspace/db/seed";
import { seedBlog } from "@workspace/db/seed-blog";
import { seedSolutions } from "@workspace/db/seed-solutions";

const rawPort = process.env["PORT"];

if (!rawPort) {
  throw new Error(
    "PORT environment variable is required but was not provided.",
  );
}

const port = Number(rawPort);

if (Number.isNaN(port) || port <= 0) {
  throw new Error(`Invalid PORT value: "${rawPort}"`);
}

const host = process.env["HOST"] || "0.0.0.0";

Promise.all([seedIfEmpty(), seedBlog(), seedSolutions()])
  .then(() => {
    app.listen(port, host, (err) => {
      if (err) {
        logger.error({ err }, "Error listening on port");
        process.exit(1);
      }

      logger.info({ port, host }, "Server listening");
    });
  })
  .catch((err) => {
    logger.error({ err }, "Failed to seed database on startup");
    process.exit(1);
  });
