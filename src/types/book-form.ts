export interface BookForm {
  title?: string;
  description?: string;
  authors?: string;
  favorite?: boolean | string;
  fileCover?: string;
  fileName?: string;
}

export interface BookData {
  title?: string;
  description: string;
  authors: string;
  favorite: boolean;
  fileCover: string;
  fileName: string;
  fileBook?: string;
}
