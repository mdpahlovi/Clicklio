import { io } from "socket.io-client";

export type SocketResponse<T = undefined> = T extends undefined
    ? {
          success: boolean;
          message: string;
      }
    : {
          success: boolean;
          message: string;
          data: T;
      };

export const socket = io(import.meta.env.VITE_APP_SERVER);
