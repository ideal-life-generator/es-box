import Koa from 'koa'
import { blue } from 'chalk'
import { APIPort } from './config'

const app = new Koa();

app.use((ctx) => {
  ctx.body = 'Hello Koa';
});

app.listen(APIPort, () => console.info(blue(`API server is listening on ${APIPort} port`)));
