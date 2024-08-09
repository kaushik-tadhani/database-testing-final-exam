import { Express } from "express";
import { DataSource } from "typeorm";
import { Photo } from "../entities/photo";
import PhotoRepository from "../repository/photoRepository";
import Result from "../utils/result";

export default class PhotoApi {
    #photoRepository: PhotoRepository;
    #express: Express;

    constructor(photoRepository: PhotoRepository, express: Express) {
        this.#photoRepository = photoRepository;
        this.#express = express;

        this.#express.get("/photo/:id", async (req, res) => {
            try {
                const result: Result<Photo> = await this.#photoRepository.get(req.params.id);

                if (result.error && result.errorCode) {
                    res.status(result.errorCode).json({ message: result.error });
                } else {
                    res.status(200).json(result.data);
                }
            } catch (error) {
                console.error('Update operation failed:', error);
                res.status(500).json({ message: 'Internal server error' });
            }
        });

        this.#express.get("/photos", async (req, res) => {
            try {
                const photos = await this.#photoRepository.getAll();
        
                res.status(200).json(photos);
            } catch (err) {
                console.error('Failed to retrieve photos:', err);
                res.status(500).json({ error: 'Internal server error' });
            }
        });

        this.#express.post("/photo", async (req, res) => {
            const { body } = req;
            console.log(body);

            const photo = new Photo();

            photo.name = body.name;
            photo.description = body.description;
            photo.filename = body.filename;

            try {
                let result = await this.#photoRepository.post(photo);
                
                if (result.error && result.errorCode) {
                    res.status(result.errorCode).json({ message: result.error });
                } else {
                    res.status(200).json(result.data);
                }
            } catch (error) {
                console.error('Update operation failed:', error);
                return res.status(500).json({ error: 'Internal server error' });
            }
        });

        this.#express.put("/photo/:id", async (req, res) => {
            const { id } = req.params;
            const { body } = req;
        
            // Parse and validate the photoId
            const photoId = parseInt(id);
            if (isNaN(photoId)) {
                return res.status(400).json({ message: 'ID must be a number' });
            }
        
            const photo: Photo = {
                id: photoId,
                name: body.name,
                description: body.description,
                filename: body.filename,
                views: body.views,
                isPublished: body.isPublished
            };
        
            try {
                // Perform the update operation
                let result = await this.#photoRepository.put(photo);
        
                if (result.error && result.errorCode) {
                    res.status(result.errorCode).json({ message: result.error });
                } else {
                    res.status(200).json(result.data);
                }
            } catch (error) {
                console.error('Update operation failed:', error);
                res.status(500).json({ error: 'Internal server error' });
            }
        });
        
        this.#express.delete("/photo/:id", async (req, res) => {
            const { id } = req.params;

            try {
                let result = await this.#photoRepository.delete(id);
        
                if (result.error && result.errorCode) {
                    res.status(result.errorCode).json({ message: result.error });
                } else {
                    res.status(200).send();
                }
            } catch (err) {
                console.error('Delete operation failed:', err);
                res.status(500).json({ error: 'Internal server error' });
            }
        });
    }
}

