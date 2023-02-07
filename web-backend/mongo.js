import mongodb from 'mongodb';

const url = 'mongodb://localhost:27017';
const client = new mongodb.MongoClient(url, { useNewUrlParser: true, useUnifiedTopology: true });

client.connect(err => {
  if (err) {
    console.error(err);
    process.exit(1);
  }

  console.log('Connected to MongoDB');
});
