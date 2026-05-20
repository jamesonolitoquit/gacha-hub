declare module '*.css' {
  const classes: Record<string, string>;
  export default classes;
}

declare module 'next/image-types/global' {
  export {};
}
