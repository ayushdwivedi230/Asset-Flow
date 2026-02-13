declare module 'howler' {
  export class Howl {
    constructor(opts: {
      src?: string[];
      volume?: number;
      loop?: boolean;
      [key: string]: any;
    });
    play(): any;
    stop(): any;
    pause(): any;
    unload(): any;
    on(event: string, cb: (...args: any[]) => void): any;
  }
}
