import fs from "fs";
import path from "path";

const randomFileName = (fileName: string): string => {
    let result = "";
    const characters = 
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    const charsLength = characters.length;
    for ( let i = 0; i < 10; i++ ){
        result += characters.charAt(Math.floor(Math.random() * charsLength));
    }
    result += (Date.now() + path.extname(fileName));
    return result;
};

export enum FileType {
    Menu = "menu",
    Store = "store"
}

export async function uploadImage(file:any, type: FileType) {
        const { filename, createReadStream } = await file;
        const stream = createReadStream();
        const filePath = `public/images/${type}/`+randomFileName(filename);

        if (!fs.existsSync(`public/images/${type}`)) {
            fs.mkdirSync(`public/images/${type}`);
        }

        await new Promise((resolve, reject) => {
            stream
            .on('error', error => {
                if (stream.truncated)
                // Delete the truncated file
                fs.unlinkSync(filePath);
                reject(error);
            })
            .pipe(fs.createWriteStream(filePath))
            .on('error', error => reject(error))
            .on('finish', () => resolve(filePath))
        });
    return filePath.replace("public","");
}

export async function uploadFile(file:any) {
    const { filename, createReadStream } = await file;
    const stream = createReadStream();
    const filePath = `public/files/`+randomFileName(filename);

    if (!fs.existsSync(`public/files`)) {
        fs.mkdirSync(`public/files`);
    }

    await new Promise((resolve, reject) => {
        stream
        .on('error', error => {
            if (stream.truncated)
            // Delete the truncated file
            fs.unlinkSync(filePath);
            reject(error);
        })
        .pipe(fs.createWriteStream(filePath))
        .on('error', error => reject(error))
        .on('finish', () => resolve(filePath))
    });
    return filePath.replace("public","");
}

export default {
    uploadImage,
}