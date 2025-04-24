import jwt from 'jsonwebtoken';
import { User } from '../@types/user';
import { CollectionWithArrayInJson } from '../@types/collection';

export const generateJwtToken = (data: User): string => jwt.sign(data, process.env.JWT_SECRET_KEY as string);

export const convertJsonArrayToObjectArray = (obj: CollectionWithArrayInJson) => {
    const convertedArray = obj.items_list.map((i) => JSON.parse(i));

    return {
        ...obj,
        items_list: convertedArray,
    };
};
