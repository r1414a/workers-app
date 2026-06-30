import { SOCKET_BASE_URL } from "@/constants/location";
import type { WorkerAlert } from "@/types/location.types";
import { io, Socket } from "socket.io-client";

type AlertHandler = (alert: WorkerAlert) => void;

class SocketService {
  private socket: Socket | null = null;
  private alertHandler: AlertHandler | null = null;
  private joinTarget: { workerId: string; siteId: string } | null = null;
  private joinedKey: string | null = null;

  connect() {
    // Reuse the existing socket even while it is still connecting, so a burst
    // of callers during startup never spawns multiple connections.
    if (this.socket) return this.socket;

    const socket = io(SOCKET_BASE_URL, {
      transports: ["websocket"],
      autoConnect: true,
      reconnection: true,
      reconnectionAttempts: 10,
      reconnectionDelay: 2000,
    });

    socket.on("connect", () => {
      // Fresh connection (or a reconnect) — allow the join to be (re)sent once.
      this.joinedKey = null;
      this.emitJoin();
    });

    socket.on("disconnect", () => {
      this.joinedKey = null;
    });

    socket.on("alert", (alert: WorkerAlert) => {
      this.alertHandler?.(alert);
    });

    this.socket = socket;
    return socket;
  }

  private emitJoin() {
    if (!this.socket?.connected || !this.joinTarget) return;

    const key = `${this.joinTarget.workerId}:${this.joinTarget.siteId}`;
    if (this.joinedKey === key) return; // already joined on this connection

    this.socket.emit("site:join", this.joinTarget);
    this.joinedKey = key;
  }

  disconnect() {
    this.socket?.disconnect();
    this.socket = null;
    this.joinTarget = null;
    this.joinedKey = null;
  }

  joinSite(workerId: string, siteId: string) {
    this.joinTarget = { workerId, siteId };
    this.connect();
    this.emitJoin();
  }

  onAlert(handler: AlertHandler) {
    this.alertHandler = handler;
  }

  isConnected() {
    return Boolean(this.socket?.connected);
  }
}

export const socketService = new SocketService();
