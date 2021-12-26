import logger from '../services/logger';
import BaseError from './BaseError';

class OasisError extends BaseError {
  constructor(msg: string, public metadata?: Record<string, unknown>) {
    super('Oasis Error', msg, 500, metadata);
  }

  public log() {
    logger.error(this);
  }
}
export { OasisError };
