import { Photo } from "../../entities/photo";
import DataConnector from "../../interfaces/dataConnector";
import FilteringOptions from "../../interfaces/photoFilteringOptions";
import Result from "../../utils/result";

export default class PhotoRepository {
    #dataConnector: DataConnector<Photo, FilteringOptions>

    constructor(dataConnector: DataConnector<Photo, FilteringOptions>,) {
        this.#dataConnector = dataConnector
    }
   
    async get(id: string): Promise<Result<Photo>> {

        const photoId = parseInt(id);

        if(isNaN(photoId)) return { error: 'ID must be a number', errorCode: 400 };
        if (typeof photoId !== 'number') return { error: 'ID must be a number', errorCode: 400 };
        if (photoId < 0) return { error: 'Photo ID cannot be less than 0', errorCode: 400 };

        try {
            let photo = await this.#dataConnector.findById({ photoId });
            if (!photo) return { error: 'Photo not found', errorCode: 404 };

            return { data: photo };
        } catch (error) {
            return { error: 'Database error', errorCode: 500 };
        }
    }

    async getAll(): Promise<Result<Photo[]>> {
        try {
            let photos = await this.#dataConnector.getAll();
            return { data: photos };
        } catch (error) {
            return { error: 'Database error', errorCode: 500 };
        }
    }

    async post(photo: Photo): Promise<Result<Photo>> {

        if (photo.name.length > 100) return { error: "Photo name length should not be over 100 characters.", errorCode: 400 };

        photo.isPublished = true;
        photo.views = 0;

        try {
            let savedPhoto = await this.#dataConnector.create(photo);
            return { data: savedPhoto };
        } catch(error) {
            return { error: 'Database error', errorCode: 500 };
        }
    }

    async put(photo: Photo): Promise<Result<Photo>> {
        if (photo.name.length > 100) return { error: "Photo name length should not be over 100 characters.", errorCode: 400 };

        try {
            let savedPhoto = await this.#dataConnector.update(photo);
            return { data: savedPhoto };
        } catch(error) {
            return { error: 'Database error', errorCode: 500 };
        }
    }

    async delete(id: string): Promise<Result<void>> {
        const photoId = parseInt(id);

        if (isNaN(photoId)) return { error: 'ID must be a number', errorCode: 400 };
        if (photoId < 0) return { error: 'Photo ID cannot be less than 0', errorCode: 400 };

        try {
            const photo = await this.#dataConnector.findById({ photoId });

            if (!photo) return { error: 'Photo not found', errorCode: 404 };

            await this.#dataConnector.delete(photoId); 
            
            return { data: undefined };
        } catch (error) {
            return { error: 'Database error', errorCode: 500 };
        }
    }
}

