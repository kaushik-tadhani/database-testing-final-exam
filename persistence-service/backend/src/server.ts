
import * as dotenv from 'dotenv';
import * as path from 'path';

dotenv.config({ path: path.resolve(__dirname, '../../.env') });

import cors from "cors";
import express, { json } from "express";
import postgresDataSource from "./configure";
import PhotoApi from "./api/photoApi";
import PhotoRepository from "./repository/photoRepository";
import { PhotoRepositoryDataConnector } from './repository/photoRepositoryDataConnector';

(async () => {
    const app = express();
    app.use(cors());
    app.use(json());
    
    console.log(process.env.DB_HOST);

    const datasource = await postgresDataSource.initialize();

    const photoRepositoryDataConnector = new PhotoRepositoryDataConnector(datasource);
    const photoRepository = new PhotoRepository(photoRepositoryDataConnector)

    new PhotoApi(photoRepository, app);
    app.get("/", (_, res) => {
        return res.send("hello world");
    });

    app.listen(8000, () => {
        console.log(`express server started on 8000`);
    });
})().catch((err) => console.log(err));
