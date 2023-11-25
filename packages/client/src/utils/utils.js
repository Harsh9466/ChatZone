export const serverURL = process.env.BASE_URL || "http://localhost:4000";

export const hasKeys = (obj = {}) => {
  return obj && Object.keys(obj).length > 0 ? true : false;
};

export const Screen = {
  get isMobileView() {
    return window.screen.width < 426;
  }
};
