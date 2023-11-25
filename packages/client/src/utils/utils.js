export const serverURL = "https://chatzone-1awf.onrender.com";

export const hasKeys = (obj = {}) => {
  return obj && Object.keys(obj).length > 0 ? true : false;
};

export const Screen = {
  get isMobileView() {
    return window.screen.width < 426;
  }
};
