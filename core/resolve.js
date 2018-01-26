export default async resolve => (resolve instanceof Promise ? await resolve : resolve)
