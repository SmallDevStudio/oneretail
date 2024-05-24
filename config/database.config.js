export const dbConfig = { 
    "provider": {
       "firebase": {
         apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY, 
         authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
         databaseURL: process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL,
         projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
         storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
         messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
         appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
       },

       "firebaseadmin": {
          type: process.env.NEXT_PUBLIC_FIREBASE_ADMIN_TYPE,
          project_id: process.env.NEXT_PUBLIC_FIREBASE_ADMIN_PROJECT_ID,
          private_key_id: process.env.NEXT_PUBLIC_FIREBASE_ADMIN_PRIVATE_KEY_ID,
          private_key: process.env.NEXT_PUBLIC_FIREBASE_ADMIN_PRIVATE_KEY,
          client_email: process.env.NEXT_PUBLIC_FIREBASE_ADMIN_CLIENT_EMAIL,
          client_id: process.env.NEXT_PUBLIC_FIREBASE_ADMIN_CLIENT_ID,
          auth_uri: process.env.NEXT_PUBLIC_FIREBASE_ADMIN_AUTH_URI,
          token_uri: process.env.NEXT_PUBLIC_FIREBASE_ADMIN_TOKEN_URI,
          auth_provider_x509_cert_url: process.env.NEXT_PUBLIC_FIREBASE_ADMIN_AUTH_PROVIDER_X509_CERT_URL,
          client_x509_cert_url: process.env.NEXT_PUBLIC_FIREBASE_ADMIN_CLIENT_X509_CERT_URL
       },
 
       "mongodb": {
          host: process.env.MONGODB_HOST,
          port: process.env.MONGODB_PORT,
          user: process.env.MONGODB_USER,
          password: process.env.MONGODB_PASSWORD,
          database: process.env.MONGODB_DATABASE
       },
 
       "mysql": {
          host: process.env.MYSQL_HOST,
          port: process.env.MYSQL_PORT,
          user: process.env.MYSQL_USER,
          password: process.env.MYSQL_PASSWORD,
          database: process.env.MYSQL_DATABASE
       },
 
       "postgres": {
          host: process.env.POSTGRES_HOST,
          port: process.env.POSTGRES_PORT,
          user: process.env.POSTGRES_USER,
          password: process.env.POSTGRES_PASSWORD,
          database: process.env.POSTGRES_DATABASE
       }
    }
 }