class OasisLog {

  private message: string;

  constructor(public msg: string, public metadata?: Record<string, unknown>) {
    this.message = msg;
  }

  public log() {
    const noMetadata = !this.metadata || Object.entries(this.metadata).length === 0
    if (noMetadata) {
      console.log(this.message);
    } else {
      console.log(this.message, this.metadata);
    }
  }

  public warn() {
    const noMetadata = !this.metadata || Object.entries(this.metadata).length === 0
    if (noMetadata) {
      console.warn(this.message);
    } else {
      console.warn(this.message, this.metadata);
    }
  }
}

export { OasisLog }