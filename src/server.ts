import { app } from "./app.js"
import { env } from "./config/env.js"
import { logger } from "./lib/logger.js"

const startServer = async (): Promise<void> => {
    try {
        const server = app.listen(env.PORT, () => {
            logger.info({
                port: env.PORT
            },
             "Auth service started"
            )
        })



        const shutdown = async (signal: string): Promise<void> => {
            logger.info({ signal }, "Shutdown initiated");
            server.close(async () => {
                logger.info("Shutdown completed.")
                process.exit(0)
            })
        }

        process.on("SIGTERM", () => {
            void shutdown("SIGTERM")
        })

        process.on("SIGINT", () => {
            void shutdown("SIGINT")
        })
    } catch (error) {
        logger.fatal({ error }, "Failed to start auth service");
        process.exit(1)
    }
}

void startServer()