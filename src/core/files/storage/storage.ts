import fs from "fs";
import { diskStorage } from "multer";
import path, { extname } from "path";

export const FILES_PATH = path.resolve(__dirname, "../../../../uploadFiles");

export const storage = diskStorage({
    destination: (req, file, callBack) => {
        console.log("STORAGE URL: ", req.url);

        // const { profileId } = req.params;
        //
        // let dir = "";
        //
        // if (req.url.includes("avatar")) {
        //     dir = path.resolve(
        //         __dirname,
        //         "../../../../uploadFiles",
        //         profileId,
        //         "profile",
        //     );
        // }

        // if (!dir) {
        //     callBack(
        //         new Error(
        //             "DISK STORAGE: URL для загрузки изображений не известен",
        //         ),
        //         dir,
        //     );
        // }

        try {
            if (!fs.existsSync(FILES_PATH)) {
                fs.mkdirSync(FILES_PATH, { recursive: true });
            }
        } catch (e) {
            callBack(e, FILES_PATH);
        }

        callBack(null, FILES_PATH);
    },
    filename: (req, file, cb) => {
        const name = file.originalname.split(".")[0];
        const extension = extname(file.originalname);
        const randomName = Array(32)
            .fill(null)
            .map(() => Math.round(Math.random() * 16).toString(16))
            .join("");
        cb(null, `${name}-${randomName}${extension}`);

        // cb(null, `profile${extension}`);
    },
});
