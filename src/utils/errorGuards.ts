interface BodyParserError extends Error {
  type: string
  status: number
}

export const isBodyParserError = (err: unknown): err is BodyParserError => {
  return err instanceof Error && 'type' in err
}
