import { AccessTokenPayload } from "./auth.ts";

declare global{
    namespace Express{
        interface Request{
            user?:AccessTokenPayload
        }
    }
}