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

export const socketResponse = <T>(event: string, data: Record<string, any>) =>
    new Promise<SocketResponse<T>>((resolve, reject) => {
        const timeoutId = setTimeout(() => {
            reject(new Error("Socket timeout", { cause: "SOCKET" }));
        }, 30000);

        socket.emit(event, data, (response: SocketResponse<T>) => {
            clearTimeout(timeoutId);
            if (response.success) {
                resolve(response);
            } else {
                reject(new Error(response.message, { cause: "SOCKET" }));
            }
        });
    });
