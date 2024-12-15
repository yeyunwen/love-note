import request from "@/utils/request";

export const getNotesApi = (params: any = {}) => {
  return request({
    url: "/note",
    method: "get",
    params,
  });
};
