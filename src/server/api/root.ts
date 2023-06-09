import { createTRPCRouter } from "./trpc";
import { locationRouter } from "./routers/location";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  location: locationRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
