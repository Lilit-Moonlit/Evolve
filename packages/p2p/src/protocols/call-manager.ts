import { generateId } from "@evolve/core";
import { CallState } from "../types";
import type {
  CallOffer,
  CallAccept,
  ICECandidate,
  CallHangup,
  CallSignal,
  ILogger,
} from "../types";

export interface CallHandlers {
  onOffer?: (callId: string, from: string, to: string) => void;
  onAccept?: (callId: string, from: string, to: string) => void;
  onHangup?: (callId: string, from: string, reason?: string) => void;
  onICECandidate?: (callId: string, from: string, candidate: string) => void;
}

export class CallManager {
  private calls: Map<string, CallState> = new Map();
  private offerCallbacks: ((
    callId: string,
    from: string,
    to: string,
  ) => void)[] = [];
  private acceptCallbacks: ((
    callId: string,
    from: string,
    to: string,
  ) => void)[] = [];
  private hangupCallbacks: ((
    callId: string,
    from: string,
    reason?: string,
  ) => void)[] = [];
  private iceCallbacks: ((
    callId: string,
    from: string,
    candidate: string,
  ) => void)[] = [];

  constructor(private logger: ILogger = consoleLogger) {}

  createCall(from: string, to: string): CallOffer {
    const callId = generateId();
    const offer: CallOffer = {
      type: "offer",
      callId,
      from,
      to,
      sdp: "",
      timestamp: Date.now(),
    };

    this.calls.set(callId, CallState.Calling);

    for (const cb of this.offerCallbacks) {
      cb(callId, from, to);
    }

    this.logger.debug(`Call ${callId} created from ${from} to ${to}`);
    return offer;
  }

  getOffer(callId: string): CallOffer {
    const state = this.calls.get(callId);
    if (state === undefined) {
      throw new Error(`Call ${callId} not found`);
    }
    return {
      type: "offer",
      callId,
      from: "",
      to: "",
      sdp: "",
      timestamp: Date.now(),
    };
  }

  acceptCall(callId: string): CallAccept {
    const state = this.calls.get(callId);
    if (state === undefined) {
      throw new Error(`Call ${callId} not found`);
    }

    this.calls.set(callId, CallState.Connected);

    const accept: CallAccept = {
      type: "accept",
      callId,
      from: "",
      to: "",
      sdp: "",
      timestamp: Date.now(),
    };

    for (const cb of this.acceptCallbacks) {
      cb(callId, accept.from, accept.to);
    }

    this.logger.debug(`Call ${callId} accepted`);
    return accept;
  }

  hangupCall(callId: string, reason?: string): CallHangup {
    const state = this.calls.get(callId);
    if (state === undefined) {
      throw new Error(`Call ${callId} not found`);
    }

    this.calls.set(callId, CallState.Ended);

    const hangup: CallHangup = {
      type: "hangup",
      callId,
      from: "",
      to: "",
      reason,
      timestamp: Date.now(),
    };

    for (const cb of this.hangupCallbacks) {
      cb(callId, hangup.from, reason);
    }

    this.calls.delete(callId);
    this.logger.debug(
      `Call ${callId} ended${reason !== undefined ? `: ${reason}` : ""}`,
    );
    return hangup;
  }

  async receive(signal: CallSignal): Promise<void> {
    switch (signal.type) {
      case "offer":
        this.handleOffer(signal);
        break;
      case "accept":
        this.handleAccept(signal);
        break;
      case "hangup":
        this.handleHangup(signal);
        break;
      case "ice":
        this.handleICE(signal);
        break;
    }
  }

  getState(callId: string): CallState | undefined {
    return this.calls.get(callId);
  }

  getActiveCalls(): Map<string, CallState> {
    const active = new Map<string, CallState>();
    for (const [id, state] of this.calls) {
      if (
        state === CallState.Calling ||
        state === CallState.Ringing ||
        state === CallState.Connected
      ) {
        active.set(id, state);
      }
    }
    return active;
  }

  onOffer(callback: (callId: string, from: string, to: string) => void): void {
    this.offerCallbacks.push(callback);
  }

  onAccept(callback: (callId: string, from: string, to: string) => void): void {
    this.acceptCallbacks.push(callback);
  }

  onHangup(
    callback: (callId: string, from: string, reason?: string) => void,
  ): void {
    this.hangupCallbacks.push(callback);
  }

  onICECandidate(
    callback: (callId: string, from: string, candidate: string) => void,
  ): void {
    this.iceCallbacks.push(callback);
  }

  private handleOffer(signal: CallOffer): void {
    if (!this.calls.has(signal.callId)) {
      this.calls.set(signal.callId, CallState.Ringing);
    }
    for (const cb of this.offerCallbacks) {
      cb(signal.callId, signal.from, signal.to);
    }
  }

  private handleAccept(signal: CallAccept): void {
    this.calls.set(signal.callId, CallState.Connected);
    for (const cb of this.acceptCallbacks) {
      cb(signal.callId, signal.from, signal.to);
    }
  }

  private handleHangup(signal: CallHangup): void {
    this.calls.delete(signal.callId);
    for (const cb of this.hangupCallbacks) {
      cb(signal.callId, signal.from, signal.reason);
    }
  }

  private handleICE(signal: ICECandidate): void {
    for (const cb of this.iceCallbacks) {
      cb(signal.callId, signal.from, signal.candidate);
    }
  }

  private isCallOffer(signal: CallSignal): signal is CallOffer {
    return (
      "sdp" in signal &&
      "callId" in signal &&
      "from" in signal &&
      "to" in signal &&
      !("candidate" in signal) &&
      !("reason" in signal)
    );
  }

  private isCallAccept(signal: CallSignal): signal is CallAccept {
    return (
      "sdp" in signal &&
      "callId" in signal &&
      "from" in signal &&
      "to" in signal &&
      !("candidate" in signal) &&
      !("reason" in signal)
    );
  }

  private isCallHangup(signal: CallSignal): signal is CallHangup {
    return "reason" in signal;
  }

  private isICECandidate(signal: CallSignal): signal is ICECandidate {
    return "candidate" in signal;
  }
}

const consoleLogger: ILogger = {
  info: (message, ...args) => console.log(`[CallManager] ${message}`, ...args),
  warn: (message, ...args) => console.warn(`[CallManager] ${message}`, ...args),
  error: (message, ...args) =>
    console.error(`[CallManager] ${message}`, ...args),
  debug: (message, ...args) =>
    console.debug(`[CallManager] ${message}`, ...args),
};
