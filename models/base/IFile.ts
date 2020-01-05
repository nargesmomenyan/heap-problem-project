
export interface IFile {
    Type?: number
    Extension?: string
    ContentType?: string
    FileName?: string
    Body?: Buffer | Uint8Array | Blob | string 
}