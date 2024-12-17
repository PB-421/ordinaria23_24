import { ApolloServer } from "@apollo/server";
import { startStandaloneServer } from "@apollo/server/standalone";
import { MongoClient } from "mongodb";
import { schema } from "./schema.ts";
import { resolvers } from "./resolvers.ts";
import { ContactModel } from "./types.ts";

const urlMongo = Deno.env.get("MONGO_URL")

if(!urlMongo){
  console.error("url de mongo no encontrada")
  Deno.exit(-1)
}

const client = new MongoClient(urlMongo);

  await client.connect();
  console.log('Connected successfully to server');
  const db = client.db('Encadenados');
  const collectionContacts = db.collection<ContactModel>('Contacts');

  const server = new ApolloServer({
    typeDefs:schema,
    resolvers,
  });
  
  const { url } = await startStandaloneServer(server, {
    listen: { port: 8080 }, context: async () => (await {collectionContacts})
  });
  
  console.log(`Server running on: ${url}`);