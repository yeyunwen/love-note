import request from "@/utils/request";
import { Note } from "../note";

export interface UploadImgsRes {
  id: number;
  originalname: string;
  size: number;
  url: string;
  width: number;
  height: number;
}

export const uploadImgsApi = (files: FormData) => {
  return request<UploadImgsRes[]>({
    url: "/upload/local/note-image",
    method: "post",
    headers: {
      "Content-Type": "multipart/form-data",
    },
    data: files,
  });
};

export interface CreateNoteDto {
  title: string;
  content: string;
  imageIds: number[];
}

export const createNoteApi = (data: CreateNoteDto) => {
  return request<Note>({
    url: "/note",
    method: "post",
    data,
  });
};
