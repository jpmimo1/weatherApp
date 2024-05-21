import { AxiosResponse } from "axios";

export const axiosResponseHandler: <Type>(response: AxiosResponse<Type>) => Type = (response) => {
  if (response.status !== 200) {
    throw response.statusText;
  }
  else {
    return response.data;
  }
}
