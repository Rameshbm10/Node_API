class CustomErrorHandler extends Error {
    public status: number;
    public msg: string;
  
    constructor(status: number, msg: string) {
      super();
      this.status = status;
      this.msg = msg;
    }
  
    static customError(status: number, msg: string): CustomErrorHandler {
      return new CustomErrorHandler(status, msg);
    }
  }
  
  export default CustomErrorHandler;
  