export const OBJECT_ID_RULE = /^[0-9a-fA-F]{24}$/
export const OBJECT_ID_MESSAGE = 'Your string fails to match the Object id pattern!'

export const OBJECT_PASSWORD_RULE = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9])(?!.*\s).{8,15}$/
export const OBJECT_PASSWORD_MESSAGE = 'Minimum eight and maximum 10 characters, at least one uppercase letter, one lowercase letter, one number and one special character'

export const OBJECT_EMAIL_RULE = new RegExp(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/)
export const OBJECT_EMAIL_MESSAGE = 'Invalid Email!'

