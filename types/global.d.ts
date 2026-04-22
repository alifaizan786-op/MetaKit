// types/global.d.ts
declare global {
  var mongoose: { 
    conn: null | typeof import('mongoose'); 
    promise: null | Promise<typeof import('mongoose')>; 
  };
}

export {};