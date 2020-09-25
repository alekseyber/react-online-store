import qs from "qs";
import axios from "./axios-store";


const fetchData = async (url, method = "get", params = null, body = null) => {
    try {
      //  axios.defaults.baseURL = (process.env.NODE_ENV === 'development') ? 'http://localhost:5000' : '';
  
      const config = {
        method,
        url,
      };
  
      if (params) {
        config.params = params;
      }
  
      if (body) {
        config.data = qs.stringify(body);
      }
  
      const { data } = await axios(config);
  
      return data;
    } catch (e) {
      throw e;
    }
  };


  export default fetchData;