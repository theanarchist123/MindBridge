// This file is BROWSER-ONLY. Never import this in API routes or server components.
import PusherClient from 'pusher-js'

export const pusherClient = new PusherClient(process.env.NEXT_PUBLIC_PUSHER_KEY!, {
  cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER!,
  authEndpoint: '/api/pusher/auth',
})

