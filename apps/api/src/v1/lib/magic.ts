import { Magic } from '@magic-sdk/admin';

const magic = new Magic(process.env.MAGIC_SECRET_API_KEY);

export default magic;
