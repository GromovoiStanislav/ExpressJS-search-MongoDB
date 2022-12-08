import express from 'express';
import { DataSource } from 'typeorm';
import { Product } from './entity/product';

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
  .then((connection) => {
    const productRepository = connection.getMongoRepository(Product);

    const app = express();

    app.use(express.json());

    app.get('/api/products/frontend', async (req, res) => {
      const products = await productRepository.find({});
      res.send(products);
    });

    app.get('/api/products/backend', async (req, res) => {
      let options = {};

      if (req.query.s) {
        options = {
          ...options,
          where: {
            $or: [
              { title: new RegExp(req.query.s.toString(), 'i') },
              { description: new RegExp(req.query.s.toString(), 'i') },
            ],
          },
        };
      }

      if (req.query.sort) {
        options = {
          ...options,
          order: {
            price: req.query.sort.toString().toUpperCase(),
          },
        };
      }

      const page: number = parseInt(req.query.page as any) || 1;
      const take = 9;
      const total = await productRepository.count();

      const data = await productRepository.find({
        ...options,
        take,
        skip: (page - 1) * take,
      });

      res.send({
        data,
        total,
        page,
        last_page: Math.ceil(total / take),
      });
    });

    console.log('listening to port 3000');
    app.listen(3000);
  })
  .catch((err) => {
    console.error(`Data Source initialization error`, err);
  });
