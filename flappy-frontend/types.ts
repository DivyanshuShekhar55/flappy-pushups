export interface Bird {
  y_pos: number;
  x_pos: number;
}

export interface SharedValue<Value = unknown> {
  value: Value;
  addListener: (listenerID: number, listener: (value: Value) => void) => void;
  removeListener: (listenerID: number) => void;
  modify: (
    modifier?: <T extends Value>(value: T) => T,
    forceUpdate?: boolean
  ) => void;
}

export interface Pipe {
    x_pox: SharedValue<number>;
    y_pos: number;
    vx: number;
    height: number;
    width: number;
  }
