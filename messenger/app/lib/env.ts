import { z } from 'zod'

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
  DATABASE_URL: z.string().min(1),
  NEXTAUTH_SECRET: z.string().min(32),
  NEXTAUTH_URL: z.string().url().optional(),
  
  // OAuth
  GITHUB_ID: z.string().min(1),
  GITHUB_SECRET: z.string().min(1),
  GOOGLE_CLIENT_ID: z.string().min(1).optional(),
  GOOGLE_CLIENT_SECRET: z.string().min(1).optional(),
  
  // Services
  SENDGRID_API_KEY: z.string().min(1),
  EMAIL_FROM: z.string().email(),
  
  // Pusher
  NEXT_PUBLIC_PUSHER_APP_KEY: z.string().min(1),
  PUSHER_APP_ID: z.string().min(1),
  PUSHER_SECRET: z.string().min(1),
  
  // Cloudinary
  NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME: z.string().min(1),
})

const env = envSchema.parse(process.env)

export default env