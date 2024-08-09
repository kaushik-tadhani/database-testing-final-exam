import { Photo } from "../entities/photo";
import DataConnector from "../interfaces/dataConnector";
import { MockPhotoRepositoryDataConnector } from "./mockPhotoRepositoryDataConnector";
import PhotoRepository from "./photoRepository";

describe('Photo Api', () => {
    let photoApi: any;

    beforeAll(() => {
        photoApi = new PhotoRepository(new MockPhotoRepositoryDataConnector());
    });

    test('will throw an error if id is not a number', async () => {
        let photo = await photoApi.get('abcd');

        expect(photo.error).toBe('ID must be a number')
        expect(photo.errorCode).toBe(400);
    });

    test('will throw an error if id is less than 0', async () => {
        let photo = await photoApi.get('-1');

        expect(photo.error).toBe('Photo ID cannot be less than 0')
        expect(photo.errorCode).toBe(400);
    });

    test('will throw an error if id is not found', async () => {
        let photo = await photoApi.get('2');

        expect(photo.error).toBe('Photo not found')
        expect(photo.errorCode).toBe(404);
    });

    test('a photo is returned if a positive id is provided', async () => {
        let photo = await photoApi.get('1');

        expect(photo.data).toStrictEqual(
            {
                id: 1,
                name: 'a mocked photo entity',
                description: 'a description of the mocked photo entity',
                filename: 'mocked-photo-entity.png',
                views: 3,
                isPublished: true,
            });
    });

    test('will retrieve all photos', async () => {
        let photos = await photoApi.getAll();

        expect(photos.data).toStrictEqual(
            [{
                id: 1,
                name: 'a mocked photo entity',
                description: 'a description of the mocked photo entity',
                filename: 'mocked-photo-entity.png',
                views: 3,
                isPublished: true,
            }]);
    });

    test('will return error if the photo name is beyond the max length while saving', async () => {
        let photo: Photo = new Photo();
        photo.name = `Lorem Ipsum is simply dummy text of the printing and typesetting industry. 
        Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a 
        galley of type and scrambled it to make a type specimen book.`;
        photo.filename = "photo2.png";
        photo.description = "photo 2 description";
        photo.filename = "photo2.png";

        let savedPhoto = await photoApi.post(photo);
        
        expect(savedPhoto.error).toBe("Photo name length should not be over 100 characters.")
        expect(savedPhoto.errorCode).toBe(400);
    });

    test('will saved the photo', async () => {
        let photo: Photo = new Photo();
        photo.name = "photo 2";
        photo.description = "photo 2 description";
        photo.filename = "photo2.png";

        let savedPhoto = await photoApi.post(photo);

        expect(savedPhoto.data).toStrictEqual(
            {
                id: 2,
                name: "photo 2",
                description: "photo 2 description",
                filename: "photo2.png",
                views: 0,
                isPublished: true,
            });
    });

    test('will update the photo', async () => {
        let photo: Photo = new Photo();
        photo.id = 2;
        photo.name = "photo 2";
        photo.description = "photo 2 updated description";
        photo.filename = "photo2.png";
        photo.views = 10;
        photo.isPublished = true;

        let savedPhoto = await photoApi.put(photo);
        
        expect(savedPhoto.data).toStrictEqual(
            {
                id: 2,
                name: "photo 2",
                description: "photo 2 updated description",
                filename: "photo2.png",
                views: 10,
                isPublished: true,
            });
    });

        
    it('should handle deleting a non-existent photo', async () => {
        const nonExistentPhotoId = 9999;
        let photo = await photoApi.delete(nonExistentPhotoId)
        expect(photo.error).toBe('Photo not found')
        expect(photo.errorCode).toBe(404);
    });

    it('should delete an existing photo', async () => {
        await photoApi.delete(2);
        const deletedPhoto = await photoApi.get('2');
        expect(deletedPhoto.error).toBe('Photo not found')
        expect(deletedPhoto.errorCode).toBe(404);
    });
});
