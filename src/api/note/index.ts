import request from "@/utils/request";
import { PaginationQueryDto, PaginationResponseDto } from "@/types/request";

export enum NoteType {
  /** 全部笔记 */
  全部 = "全部",
  /** 我的笔记 */
  我的 = "我的",
  /** 恋人的笔记 */
  恋人 = "恋人的",
}

export type GetNotesParams = PaginationQueryDto & {
  type?: NoteType;
};

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
