import { DataSource } from 'typeorm';
import { Product } from '../src/entity/product';
import { faker } from '@faker-js/faker';

const connectDB = new DataSource({
  type: 'mongodb',
  host: 'localhost',
  database: 'node_search',
  synchronize: true,
  logging: false,
  entities: ['src/entity/*.ts'],
  useUnifiedTopology: true,
});

connectDB
  .initialize()
  .then(async (connection) => {
    const productRepository = connection.getMongoRepository(Product);

    for (let i = 0; i < 50; i++) {
      await productRepository.save({
        title: faker.lorem.words(2),
        description: faker.lorem.words(10),
        image: faker.image.imageUrl(),
        price: faker.datatype.number(100),
      });
    }

    process.exit();
  })
  .catch((err) => {
    console.error(`Data Source initialization error`, err);
  });
