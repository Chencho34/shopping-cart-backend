interface ErrorDetail {
  field: string
  message: string
}

export class AppError extends Error {
  public status: number
  public code?: string
  public details?: ErrorDetail[]

  constructor (message: string, status: number, code?: string, details?: ErrorDetail[]){
    super(message)
    this.name = 'AppError'
    this.status = status
    this.code = code
    this.details = details
    Object.setPrototypeOf(this, AppError.prototype)
    Error.captureStackTrace(this, this.constructor)
  } 
}
