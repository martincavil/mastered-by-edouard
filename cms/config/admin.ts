export default ({ env }) => ({
  auth: {
    secret: env("ADMIN_JWT_SECRET"),
  },
  apiToken: {
    salt: env("API_TOKEN_SALT"),
  },
  transfer: {
    token: {
      salt: env("TRANSFER_TOKEN_SALT"),
    },
  },
  secrets: {
    encryptionKey: env("ENCRYPTION_KEY"),
  },
  flags: {
    nps: false,
    promoteEE: false,
  },
  // Désactive complètement le guided tour et features qui causent des erreurs
  tutorial: false,
  features: {
    SSO: "sso",
  },
});
