// Datos de la cuenta serializada (salida de exportAccount()).
export type AccountData = Record<string, unknown>;

// Metadatos del estado local.
export type LocalMeta = {
  hasData: boolean;
  updatedAt: number | null;    // ms epoch del último cambio local
  lastSyncedAt: number | null; // ms epoch de la última sync exitosa
};

// Metadatos del estado en la nube.
export type CloudMeta = {
  exists: boolean;
  updatedAt: number | null;
};

export type SyncDecision = 'push' | 'pull' | 'ask' | 'noop';

// Documento tal como se guarda en Firestore.
export type CloudDoc = {
  data: AccountData;
  updatedAt: number;
  device: string;
};

// Puerto hacia el almacén remoto (Firestore en producción, fake en tests).
export interface CloudStore {
  get(uid: string): Promise<CloudDoc | null>;
  set(uid: string, doc: CloudDoc): Promise<void>;
}

// Puerto hacia la cuenta local (localStorage en producción, fake en tests).
export interface AccountPort {
  read(): { data: AccountData } & LocalMeta;
  write(data: AccountData, syncedAt: number): void; // importa + fija updatedAt y lastSyncedAt
  markSynced(syncedAt: number): void;               // tras un push exitoso
}
