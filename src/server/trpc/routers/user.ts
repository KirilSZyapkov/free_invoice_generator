import {router, publicProcedure} from "@/server/trpc/router";
import {userType} from "@/types/user";

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
    .input(userType)
    .mutation(async ({ctx, input})=>{
      try{
          const createdUser = await ctx.prisma.user.create({
            data:{
              clerkId: input.clerkId,
              email: input.email,
              name: input.name,
            }
          });
          return{ success: true, createdUser}
      } catch (e: unknown) {
        console.error("Prisma error", e);
        if(e instanceof Error) {
          throw new Error(`Faild to create new user: ${e.message}`)
        }
      }
    })
})