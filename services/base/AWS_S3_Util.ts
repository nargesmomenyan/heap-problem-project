import AWS from 'aws-sdk';
import S3 from 'aws-sdk/clients/s3'
import { IFileCredential } from '~/models/base/IFileCredential';
import { IFile } from '~/models/base/IFile';

export default class AWS_S3_Util {
    S3: AWS.S3
    constructor(fileCredential: IFileCredential) {
        let options: S3.Types.ClientConfiguration = {
            sessionToken: fileCredential.SessionToken,
            accessKeyId: fileCredential.AccessKey,
            secretAccessKey: fileCredential.SecretKey,
            endpoint: fileCredential.EndPoint,
            s3ForcePathStyle: true,
            signatureVersion: 'v4'
        };
        this.S3 = new AWS.S3(options)
    }

    public makeBucket() {
        let params: S3.Types.CreateBucketRequest = {
            Bucket: 'Narges-bucket'
        }
        this.S3.createBucket(params, function (err, data) {
            if (err) {

                console.log(err)
            }
            else {
                console.log(data)
            }
        })
    }

    public async putObject(fileInfo: IFile, fileCredential: IFileCredential) {

        let request: S3.Types.PutObjectRequest = {
            Bucket: fileCredential.Bucket,
            Key: fileCredential.Key,
            ContentType: fileInfo.Extension,
            Body: fileInfo.Body
        }
        await this.S3.putObject(request).promise().then(data => {
            console.log('File uploaded successfully.', data)
            return data
        }).catch(err => {
            console.log('File upload failed.', err)
            throw err
        })
    }

    public async getObject(fileCredential: IFileCredential): Promise<string> {

        let request: S3.Types.GetObjectRequest = {
            Bucket: fileCredential.Bucket,
            Key: fileCredential.Key,
        }
        return await this.S3.getObject(request).promise().then(data => {
            if (data.Body) {
                debugger
                let xxx: any = data.Body
                let image = `data:image/${data.ContentType};base64,` + this.encode(xxx);
                return image || ''
            }
            else {
                return ''
            }
        }).catch(err => {

            console.log('getObject failed.', err)
            throw err
        })
    }

    getSignedUrlOfObject(fileCredential: IFileCredential): string {
        
        return this.S3.getSignedUrl('getObject', {
            Bucket:  fileCredential.Bucket,
            Key: fileCredential.Key// 'path20-1.png'
        })
    }

    encode(data) {
        var str = data.reduce(function (a, b) { return a + String.fromCharCode(b) }, '');
        return btoa(str).replace(/.{76}(?=.)/g, '$&\n');
    }
}