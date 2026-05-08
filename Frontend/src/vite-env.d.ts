/// <reference types="vite/client" />

interface Window {
  google?: {
    accounts?: {
      id?: {
        initialize: (options: {
          client_id: string
          callback: (response: { credential?: string }) => void
        }) => void
        renderButton: (
          element: HTMLElement,
          options: {
            theme: string
            size: string
            type: string
            text: string
            shape: string
            width: number
          }
        ) => void
      }
    }
  }
}
