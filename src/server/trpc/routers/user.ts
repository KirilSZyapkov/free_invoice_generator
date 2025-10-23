import {router, publicProcedure} from "@/server/trpc/router";

export const userRouter = router({
  getAllUsers: publicProcedure.query(async ({ctx})=>{
    return [
      { id: 1, customer: 'User A'},
      { id: 2, customer: 'User B'}
    ]
  }),
  getUserById:publicProcedure.query(async ({ctx})=>{
    const userId = ctx.userId;
    return {
      user: "User",
      id: userId
    }
  }),
  createNewUser: publicProcedure
    .input()
    .mutation(async ({ctx, input})=>{
      try{

      } catch (e: unknown) {
        console.error("Prisma error", e);
        if(e instanceof Error) {
          throw new Error(`Faild to create new user: ${e.message}`)
        }
      }
    })
})