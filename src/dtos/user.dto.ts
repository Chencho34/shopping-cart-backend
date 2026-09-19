type Role = 'admin' | 'user'

export interface CreateUserDto {
  username: string
  email: string
  password: string
}

export interface UpdateUserDto {
  name?: string
  email?: string
  password?: string
}

export interface LoginUserDto {
  email: string
  password: string
}

export interface AuthUserDto {
  id: number
  username: string
  email: string
  role: Role
}

export interface AuthResponseDto {
  token: string
  user: AuthUserDto
}
