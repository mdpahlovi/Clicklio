import { User } from "../model/user.entity";

declare module "express" {
    interface Request {
        user: User;
    }
}
