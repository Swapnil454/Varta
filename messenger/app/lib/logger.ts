export const isProd = process.env.NODE_ENV === 'production'
export const isDev = process.env.NODE_ENV === 'development'

type LogLevel = 'debug' | 'info' | 'warn' | 'error'

interface Logger {
  debug: (message: string, data?: any) => void
  info: (message: string, data?: any) => void
  warn: (message: string, data?: any) => void
  error: (message: string, error?: any) => void
}

class ProductionLogger implements Logger {
  private formatMessage(level: LogLevel, message: string, data?: any) {
    return JSON.stringify({
      timestamp: new Date().toISOString(),
      level,
      message,
      ...(data && { data }),
    })
  }

  debug(message: string, data?: any) {
    if (isDev) console.log(this.formatMessage('debug', message, data))
  }

  info(message: string, data?: any) {
    console.log(this.formatMessage('info', message, data))
  }

  warn(message: string, data?: any) {
    console.warn(this.formatMessage('warn', message, data))
  }

  error(message: string, error?: any) {
    console.error(this.formatMessage('error', message, error))
  }
}

class DevelopmentLogger implements Logger {
  debug(message: string, data?: any) {
    console.log(` ${message}`, data || '')
  }

  info(message: string, data?: any) {
    console.log(` ${message}`, data || '')
  }

  warn(message: string, data?: any) {
    console.warn(`  ${message}`, data || '')
  }

  error(message: string, error?: any) {
    console.error(` ${message}`, error || '')
  }
}

export const logger: Logger = isProd ? new ProductionLogger() : new DevelopmentLogger()