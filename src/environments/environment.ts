// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  mixpanelID: "34c5d28fe65266c7957c8517cc855112",
  ctaAnimationDelay: 250, // milliseconds,
  cardTransitionDelay: 150,
  AM_URL: 'http://ciam-dev.mars.com:8080/auth',
  IDM_URL: 'http://ciad-dev.mars.com:8080',
  IDM_API_ALIAS: 'openidm',
  IDM_PROVISIONING_CLIENT: 'idm-provisioning',
  IDM_PROVISIONING_CLIENT_SECRET: 'openidm',
  SALESFORCE_CLIENT_ID: "e2pucvx9vwmo5h24990a8eba", 
  SALESFORCE_CLIENT_SECRET: "SAZIXUqAmqDTUO4MhTdPmgqw",
  MARS_ENV: 'bWFyc190ZXN0OldlbGNvbWVAMTIz',
  AWS_DATA_STORE_URI: "http://miomedatastoreapi-dev.eba-mcudrefh.eu-west-1.elasticbeanstalk.com",
  AWS_DATA_STORE_KEY: "9789umr87yy*&NY38n2ytr273b67bt&^*Bti7rt36tri2or8yn87yn2398fun98y2",
};
export const firebaseConfig = {
  apiKey: "AIzaSyAwCiyDoOFA20dqts6OjvEagUdNcOv6qQM",
  authDomain: "mars-miome.firebaseapp.com",
  databaseURL: "https://mars-miome.firebaseio.com",
  projectId: "mars-miome",
  storageBucket: "mars-miome.appspot.com",
  messagingSenderId: "10116363934",
  appId: "1:10116363934:web:b63bd33df6ca82aad1ed8f"
}
export const appVersion = "1.0.0"
export const appBuild = "955"

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
