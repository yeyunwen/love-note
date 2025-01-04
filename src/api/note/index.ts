import request from "@/utils/request";
import { PaginationQueryDto, PaginationResponseDto } from "@/types/request";

export type GetNotesParams = PaginationQueryDto;

export interface Image {
  id: number;
  url: string;
  width: number;
  height: number;
  noteId: number;
  createdTime: string;
  updatedTime: string;
}

export interface NoteUser {
  id: number;
  username: string;
  avatar: string;
}

export interface Note {
  id: number;
  title: string | null;
  content: string | null;
  images: Image[];
  user: NoteUser;
  createdTime: string;
  updatedTime: string;
}

export const getNotesApi = (params: GetNotesParams) => {
  return request<PaginationResponseDto<Note>>({
    url: "/note",
    method: "get",
    params,
  });
};

export const getNoteDetailApi = (id: number) => {
  return request<Note>({
    url: `/note/${id}`,
    method: "get",
  });
};
