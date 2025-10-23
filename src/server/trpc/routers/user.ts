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
  })
})