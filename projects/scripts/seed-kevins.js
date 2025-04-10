import { MongoClient, Binary } from 'mongodb';
import crypto from 'crypto';

const kevins = [
  {
    username: 'kev1',
    firstName: 'Kevin',
    lastName: 'McCartney',
    email: 'hello@kevinmccartney.is',
    avatarUrl: null,
    password: 'Password1!',
  },
  {
    username: 'kev2',
    firstName: 'Kevin',
    lastName: 'Abstract',
    email: 'kevin@gay.com',
    avatarUrl: null,
    password: 'Password1!',
  },
  {
    username: 'kev3',
    firstName: 'Kevin',
    lastName: 'Spacey',
    email: 'kevin.spacey@hollyweird.com',
    avatarUrl: null,
    password: 'Password1!',
  },
  {
    username: 'kev4',
    firstName: 'Kevin',
    lastName: 'Jonas',
    email: 'kevin.jonas@hollywood.com',
    avatarUrl: null,
    password: 'Password1!',
  },
  {
    username: 'kev5',
    firstName: 'Kevin',
    lastName: 'Bacon',
    email: 'kevin.bacon@hollywood.com',
    avatarUrl: null,
    password: 'Password1!',
  },
  {
    username: 'kev6',
    firstName: 'Kevin',
    lastName: 'Costner',
    email: 'kevin.costner@hollywood.com',
    avatarUrl: null,
    password: 'Password1!',
  },
  {
    username: 'kev7',
    firstName: 'Kevin',
    lastName: 'Durant',
    email: 'kevin.durant@nba.com',
    avatarUrl: null,
    password: 'Password1!',
  },
  {
    username: 'kev8',
    firstName: 'Kevin',
    lastName: 'Gates',
    email: 'kevin.gates@gangster.com',
    avatarUrl: null,
    password: 'Password1!',
  },
  {
    username: 'kev9',
    firstName: 'Kevin',
    lastName: 'Parker',
    email: 'kevin.parker@rocknroll.com',
    avatarUrl: null,
    password: 'Password1!',
  },
  {
    username: 'kev10',
    firstName: 'Kevin',
    lastName: 'James',
    email: 'kevin.james@hollywood.com',
    avatarUrl: null,
    password: 'Password1!',
  },
];

const client = new MongoClient(process.env.MONGO_CONN_STRING);
await client.connect();

const idpDb = client.db('kevchat_idp');
const idpUsersCollection = idpDb.collection('users');
const appDb = client.db('kevchat_app');
const appUsersCollection = appDb.collection('users');

const existingIdpKevins = [];

for (const kevin of kevins) {
  const existing = await idpUsersCollection.findOne({ username: kevin.username });

  if (!existing) {
    const { password, ...restUser } = kevin;

    const inputSalt = crypto.randomBytes(16);
    const inputHashedPassword = crypto.pbkdf2Sync(
      password,
      inputSalt,
      310000,
      32,
      'sha256',
    );

    const userDoc = {
      ...restUser,
      salt: new Binary(inputSalt),
      hashedPassword: new Binary(inputHashedPassword),
    };

    const userInsert = await idpUsersCollection.insertOne(userDoc);
    const user = await idpUsersCollection.findOne({ _id: userInsert.insertedId });
    console.log(`Inserted IDP user: ${user.username}`);
    existingIdpKevins.push(user);
  } else {
    existingIdpKevins.push(existing);
    console.log(`IDP User ${existing.username} already exists, skipping.`);
  }
}

for (const kevin of existingIdpKevins) {
  const existing = await appUsersCollection.findOne({
    username: kevin.username,
  });

  if (!existing) {
     const { hashedPassword, salt, _id, ...restUser } = kevin;
     const appUserDoc = {
       ...restUser,
       externalId: _id,
     };

     const appUserInsert = await appUsersCollection.insertOne(appUserDoc);
     const appUser = await appUsersCollection.findOne({
       _id: appUserInsert.insertedId,
     });
     console.log(`Inserted app user: ${appUser.username}`);
  } else {
    console.log(`App user ${existing.username} already exists, skipping.`);
  }
 
}

await client.close();
console.log('Seeding completed.');