import { Photo } from "../entities/photo";
import DataConnector from "../interfaces/dataConnector";
import PhotoFilteringOptions from "../interfaces/photoFilteringOptions";
import Result from "../utils/result";

export class MockPhotoRepositoryDataConnector implements DataConnector<Photo, PhotoFilteringOptions> {
    
    private mockPhotos: Photo[] = [
        {
            id: 1,
            name: 'a mocked photo entity',
            description: 'a description of the mocked photo entity',
            filename: 'mocked-photo-entity.png',
            views: 3,
            isPublished: true,
        }
    ]; 

    async findById(filteringOptions: PhotoFilteringOptions): Promise<Photo | null> {
        const photo = this.mockPhotos.find(p => p.id === filteringOptions.photoId);
        return photo || null;
    }

    async getAll(): Promise<Photo[]> {
        return this.mockPhotos;
    } 

    async create(entity: Photo): Promise<Photo> {
        const newId = 2;
        let savedPhoto: Photo = {
            ...entity,
            id: newId,
            views: 0,
            isPublished: true,
        };
        this.mockPhotos.push(savedPhoto);
        return savedPhoto;
    }

    async update (entity: Photo): Promise<Photo> {
        const index = this.mockPhotos.findIndex(p => p.id === entity.id);

        if (index === -1) {
            throw new Error('Photo not found'); // Handle the case where the photo is not found
        }

        this.mockPhotos[index] = {
            ...this.mockPhotos[index],
            ...entity
        };
       
        return this.mockPhotos[index];
    }


    async delete (id: number): Promise<void> {
        const index = this.mockPhotos.findIndex(p => p.id === id);

        if (index === -1) throw new Error('Photo not found');

        this.mockPhotos.splice(index, 1);
    }
}