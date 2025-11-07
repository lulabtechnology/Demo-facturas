export function useToast() {
  return {
    toast: ({ title, description }: { title: string; description?: string }) =>
      (window as any).__toast?.(title, description)
  }
}
