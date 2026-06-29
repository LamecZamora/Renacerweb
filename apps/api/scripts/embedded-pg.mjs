// Levanta un Postgres real embebido (sin Docker ni instalación) para desarrollo.
import EmbeddedPostgres from 'embedded-postgres';

const pg = new EmbeddedPostgres({
  databaseDir: './.pgdata',
  user: 'renacer',
  password: 'renacer',
  port: 5432,
  persistent: true,
});

async function main() {
  try {
    await pg.initialise();
  } catch (e) {
    // Ya inicializado: continuar.
    console.log('initialise:', e?.message ?? e);
  }
  await pg.start();

  // Crear la base en UTF8 (clave para acentos en español; el default de Windows es WIN1252).
  const { default: pglib } = await import('pg');
  const admin = new pglib.Client({ host: 'localhost', port: 5432, user: 'renacer', password: 'renacer', database: 'postgres' });
  await admin.connect();
  const exists = await admin.query("SELECT 1 FROM pg_database WHERE datname='renacer'");
  if (!exists.rowCount) {
    await admin.query("CREATE DATABASE renacer WITH ENCODING 'UTF8' TEMPLATE template0 LC_COLLATE 'C' LC_CTYPE 'C'");
  }
  await admin.end();
  console.log('✅ Postgres embebido en localhost:5432 (db: renacer, UTF8)');

  const shutdown = async () => { await pg.stop(); process.exit(0); };
  process.on('SIGINT', shutdown);
  process.on('SIGTERM', shutdown);
  setInterval(() => {}, 1 << 30); // mantener vivo
}

main().catch((e) => { console.error(e); process.exit(1); });
