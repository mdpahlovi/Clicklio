import { Injectable } from "@nestjs/common";
import * as bcrypt from "bcryptjs";

@Injectable()
export class HashService {
    async hash(data: string): Promise<string> {
        const saltRounds = 12;
        return bcrypt.hash(data, saltRounds);
    }

    async compare(data: string, encrypted: string): Promise<boolean> {
        return bcrypt.compare(data, encrypted);
    }
}
