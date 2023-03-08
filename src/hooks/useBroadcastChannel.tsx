import { useEffect, useRef } from 'react'

export function useBroadcastChannel (channelName: string) {
  const channelRef = useRef<BroadcastChannel | null>(null)

  useEffect(() => {
    const channel = new BroadcastChannel(channelName)

    channelRef.current = channel

    return () => {
      channel.close()
    }
  }, [channelName])

  return channelRef
}
