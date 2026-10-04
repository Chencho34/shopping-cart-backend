export class AppError extends Error {
  public status: number
  public code?: string
  public details?: object
  
  constructor (message: string, status: number, code?: string, details?: object){
    super(message)
    this.status = status
    this.code = code
    this.details = details
    Object.setPrototypeOf(this, AppError.prototype)
  } 
}
