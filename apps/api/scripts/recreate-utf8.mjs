// Recrea la base 'renacer' con codificación UTF8 (el embebido la creó en WIN1252).
import pg from 'pg';

const client = new pg.Client({ host: 'localhost', port: 5432, user: 'renacer', password: 'renacer', database: 'postgres' });
await client.connect();
await client.query('DROP DATABASE IF EXISTS renacer');
await client.query("CREATE DATABASE renacer WITH ENCODING 'UTF8' TEMPLATE template0 LC_COLLATE 'C' LC_CTYPE 'C'");
await client.end();
console.log('✅ Base renacer recreada en UTF8');
