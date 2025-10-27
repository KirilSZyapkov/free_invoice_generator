import {router, publicProcedure} from "@/server/trpc/router";
import {userType} from "@/types/user";

export const userRouter = router({
  getAllUsers: publicProcedure.query(async ({ctx})=>{
    console.log("🧠 Loading users from Prisma...");
    const allUsers = await ctx.prisma.user.findMany();
    console.log("✅ Loaded users:", allUsers);
    return { success: true, allUsers };
  }),
  getUserById:publicProcedure.query(async ({ctx})=>{
    const userId = ctx.userId;

    if(!userId) return null;

    try {
        const curUser = await ctx.prisma.user.findFirst({
          where: {clerkId: userId}
        });
        if(!curUser) return null;

        return {success: true, user: curUser};
    } catch (e: unknown){
      console.error("Prisma error", e);
      if(e instanceof Error) {
        throw new Error(`Failed to load user: ${e.message}`)
      }
    }
  }),
  createNewUser: publicProcedure
    .input(userType)
    .mutation(async ({ctx, input})=>{
      try{
        const existing = await ctx.prisma.user.findFirst({
          where: {clerkId: input.clerkId},
        });
        if(existing) return {success: false, message: "User already exists!"};

          const createdUser = await ctx.prisma.user.create({
            data:{
              clerkId: input.clerkId,
              email: input.email,
              name: input.name,
            }
          });
          return{ success: true, user: createdUser}
      } catch (e: unknown) {
        console.error("Prisma error", e);
        if(e instanceof Error) {
          throw new Error(`Failed to create new user: ${e.message}`)
        }
      }
    })
})