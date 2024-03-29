import GitHubProvider from 'next-auth/providers/github'
import GoogleProvider from 'next-auth/providers/google'
import CredentialsProvider from 'next-auth/providers/credentials'
import User from '@/app/(models)/User'
import bcrypt from 'bcrypt';

export const options = {
  providers: [
    GitHubProvider({
      profile(profile) {
        // console.log("Profile Github: ", profile);

        let userRole = "Github User"
        if (profile?.email === "unimat@unimat.hu"){
          userRole = "admin"
        }

        return {
          ...profile,
          role: userRole
        }
      },
      clientId: process.env.GITHUB_ID,
      clientSecret: process.env.GITHUB_SECRET
    }),

    GoogleProvider({
      profile(profile) {
        // console.log("Profile Google: ", profile);

        let userRole = "Google User"
        return {
          ...profile,
          id: profile.sub,
          role: userRole
        }
      },
      clientId: process.env.GOGGLE_ID,
      clientSecret: process.env.GOGGLE_SECRET
    }),
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: {
          email: "email",
          type: "text",
          placeholder: "E-mail"
        },
        password: {
          email: "password",
          type: "password",
          placeholder: "Password"
        }
      },
      async authorize(credentials){
        try {
          const foundUser = await User.findOne({email: credentials.email}).lean().exec()

          if(foundUser){
            console.log("User Esists.")
            const match = await bcrypt.compare(credentials.password, foundUser.password)

            if(match){
              console.log("Good Pass")
              delete foundUser.password
              foundUser["role"] = "Unverified Email"
              return foundUser
            }
          }
        } catch (error) {
          console.log(error)
        }
        return null
      }
    })
  ],
  callbacks: {
    // Ref: https://authjs.dev/guides/basics/role-based-access-control#persisting-the-role
    async jwt({ token, user }) {
        if (user) token.role = user.role
        return token
    },
    // If you want to use the role in client components
    async session({ session, token }) {
        if (session?.user) session.user.role = token.role
        return session
    }
  }
}
