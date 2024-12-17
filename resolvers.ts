import { Collection } from "mongodb";
import { ContactModel } from "./types.ts";
import { getCountrySpec, getTime } from "./apiFunction.ts";
import {ObjectId} from "mongodb"


type Context = {
    collectionContacts: Collection<ContactModel>
}

export const resolvers = {
    Query: {
        getContacts: async (_: unknown,__: unknown,context: Context):Promise<ContactModel[]> => {
            return await context.collectionContacts.find().toArray()
        },
        getContact: async (_: unknown,args: {id: string},context: Context):Promise<ContactModel | null> => {
            return await context.collectionContacts.findOne({_id: new ObjectId(args.id)})
        }
    },
    Mutation: {
        addContact: async (_:unknown,args: {name: string,phone: string},context:Context):Promise<ContactModel | null> => {
                const existe = await context.collectionContacts.findOne({phone: args.phone})
                if(existe){
                    return null
                }
                const countrySpec = await getCountrySpec(args.phone)


                const country = countrySpec[2] + "/" + countrySpec[0] + "/" + countrySpec[3]


                const {insertedId} = await context.collectionContacts.insertOne({
                    name: args.name,
                    phone: countrySpec[1],
                    country: country
                })

                return {
                    _id: insertedId,
                    name: args.name,
                    phone: countrySpec[1],
                    country: country
                }
        },
        updateContact: async (_:unknown, args: {id: string, name: string | null, phone: string | null},context:Context):Promise<ContactModel | null> => {
            const existe = await context.collectionContacts.findOne({_id: new ObjectId(args.id)})
            if(!existe){
                return null
            }
            let country = null
            if(args.phone){
                const existeT = await context.collectionContacts.findOne({phone: args.phone})
                if(existeT){
                    return null
                }
                const countrySpec = await getCountrySpec(args.phone)

                country = countrySpec[2] + "/" + countrySpec[0] + "/" + countrySpec[3]
            }
            const set = {
                name: args.name ?? existe.name,
                phone: args.phone ?? existe.phone,
                country: country ?? existe.country
            }

            await context.collectionContacts.updateOne({_id: existe._id},
                {$set: set}
            )

            return {
                _id: existe._id,
                name: args.name ?? existe.name,
                phone: args.phone ?? existe.phone,
                country: country ?? existe.country
            }
        },
        deleteContact: async (_: unknown,args: {id: string},context: Context):Promise<boolean> => {
            const {deletedCount} = await context.collectionContacts.deleteOne({_id: new ObjectId(args.id)})

            if(deletedCount === 0){
                return false
            }

            return true
        }
    },
    Contact: {
        id: (parent: ContactModel,_:unknown,__:unknown):string => {
            return parent._id!.toString()
        },
        country: (parent: ContactModel,_:unknown,__:unknown):string => {
            const partido = parent.country.split('/')
            return partido[1]
        },
        hour: async (parent: ContactModel ,_:unknown,__:unknown):Promise<string> => {
            const split = parent.country.split('/')
            const timezone = split[0] + "/" + split[2]
            return await getTime(timezone)
        }
    }
}