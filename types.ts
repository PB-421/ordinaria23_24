import {ObjectId} from "mongodb"

export type ContactModel = {
    _id?: ObjectId,
    name: string,
    phone: string,
    country: string
}
