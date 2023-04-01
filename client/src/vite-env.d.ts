/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_TEAM_URL: string;
  readonly VITE_TASK_URL: string;
  readonly VITE_GATEWAY_URL: string;
  readonly VITE_TEAM_ACTIVITY_URL: string;
  readonly VITE_AUTHORIZATION_URL: string;
  readonly VITE_TEAM_STATUS_CATEGORY_URL: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
