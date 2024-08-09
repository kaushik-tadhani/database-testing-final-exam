import { DataSource, DeleteResult } from "typeorm";
import DataConnector from "../interfaces/dataConnector";
import { Photo } from "../entities/photo";
import PhotoFilteringOptions from "../interfaces/photoFilteringOptions";
import Result from "../utils/result";

export class PhotoRepositoryDataConnector implements DataConnector<Photo, PhotoFilteringOptions> {
    #dataSource: DataSource;

    constructor(dataSource: DataSource) {
        this.#dataSource = dataSource;
    }

    async findById(filteringOptions: PhotoFilteringOptions): Promise<Photo | null> {
        return await this.#dataSource.manager.findOne(Photo, {
            where: { id: filteringOptions.photoId }
        });
    }

    async create(entity: Photo): Promise<Photo> {
        return await this.#dataSource.manager.save(entity);
    }

    async update(entity: Photo): Promise<Photo> {
        const result = await this.#dataSource.manager.update(Photo, entity.id, entity);

        if (result.affected === 0) throw new Error('Photo not found');
        
        return { ...entity, id: entity.id };
    }

    async delete(photoId: number): Promise<void> {
        await this.#dataSource.manager.delete(Photo, photoId);
    }

    async getAll (): Promise<Photo[]> {
        return await this.#dataSource.manager.find(Photo);
    }
}