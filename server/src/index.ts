import { app } from "./app";
import { env } from "./config/env";

async function startServer() {
  app.listen(env.PORT, () => {
    console.log(`Server running on http://localhost:${process.env.PORT}`);
  });
}

void startServer()