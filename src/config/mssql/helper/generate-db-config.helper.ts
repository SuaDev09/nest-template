interface Credential {
  needDomain: boolean;
  poolName: string;
  server: string;
  database: string;
  domain?: string; // Made optional since it's only needed if `needDomain` is true
  userName: string;
  password: string;
}

interface SQLConnection {
  poolName: string;
  trustServerCertificate?: boolean;
  server: string;
  database: string;
  driver?: string;
  user: string;
  password: string;
  domain?: string; // Made optional
  options?: {
    trustedConnection: boolean;
    enableArithAbort: boolean;
    trustServerCertificate: boolean;
  };
  requestTimeout?: number; // Added for non-domain connections
}

const generateDbConfigHelper = (credentials: Credential[]): SQLConnection[] => {
  return credentials.map((cred: Credential) => {
    const baseConfig: SQLConnection = {
      poolName: cred.poolName,
      server: cred.server,
      database: cred.database,
      user: cred.userName,
      password: cred.password,
      trustServerCertificate: true,
    };
    if (cred.needDomain) {
      return {
        ...baseConfig,
        driver: 'msnodesqlv8',
        domain: cred.domain, // Use the domain from the credential
        options: {
          trustedConnection: true,
          enableArithAbort: true,
          trustServerCertificate: true,
        },
      };
    } else {
      return {
        ...baseConfig,
        requestTimeout: 360000, // Add timeout for non-domain connections
      };
    }
  });
};

export default generateDbConfigHelper;
