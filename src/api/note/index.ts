import request from "@/utils/request";
import { PaginationQueryDto, PaginationResponseDto } from "@/types/request";

type GetNotesParams = PaginationQueryDto;

interface Image {
  id: number;
  url: string;
  width: number;
  height: number;
  noteId: number;
  createdTime: Date;
  updatedTime: Date;
}

// interface User {
//   id: number;
//   nickname: string;
// }

interface Note {
  id: number;
  title: string;
  content: string;
  images: Image[];
  // user: User;
  createdTime: Date;
  updatedTime: Date;
}

export const getNotesApi = (params: GetNotesParams) => {
  return request<PaginationResponseDto<Note>>({
    url: "/note",
    method: "get",
    params,
  });
};
