declare module "*.svg" {
    const content: any;
    export default content;
  }

declare interface Window {
  _RELOADPREFILL: () => Promise<void>;
}