const useAddGet = (): (
  url: string,
  name: string,
  value: string,
  amp?: boolean
) => string => {
  return (
    url: string,
    name: string,
    value: string,
    amp: boolean = true
  ): string => {
    let ampadd: string = "";
    if (url.indexOf("?") === -1) {
      url = url + "?" + name + "=" + value;
    } else {
      if (amp) {
        ampadd = "&amp;";
      } else {
        ampadd = "&";
      }
      url = url + ampadd + name + "=" + value;
    }
    return url;
  };
};

export { useAddGet };
