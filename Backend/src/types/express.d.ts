import { IUser } from "../models/user.model";
import { IApiKey } from "../models/apikey.model";

declare global {
  namespace Express {
    interface Request {
      user: IUser;
      apiKeyDoc: IApiKey;
    }
  }
}
