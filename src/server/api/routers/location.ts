import { z } from "zod";
import { publicProcedure } from "../trpc";
import { createTRPCRouter } from "../trpc";
import { observable } from "@trpc/server/observable";
import { EventEmitter } from "node:events";

const ee = new EventEmitter();

interface Location {
  latitude: number;
  longitude: number;
}

export const locationRouter = createTRPCRouter({
  subscribe: publicProcedure
    .input(z.object({ id: z.string().min(1) }))
    .subscription(({ input }) => {
      return observable<Location>((emit) => {
        const onUpdate = (data: Location) => {
          emit.next(data);
        };
        ee.on(`update:${input.id}`, onUpdate);
        return () => {
          ee.off(`update:${input.id}`, onUpdate);
        };
      });
    }),
  update: publicProcedure
    .input(
      z.object({
        id: z.string().min(1),
        latitude: z.number().int(),
        longitude: z.number().int(),
      })
    )
    .mutation(({ input }) => {
      ee.emit(`update:${input.id}`, {
        latitude: input.latitude,
        longitude: input.longitude,
      });
    }),
});
