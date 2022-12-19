import { IconType } from "react-icons/lib/esm/iconBase";
import {
  SiReact,
  SiChakraui,
  SiChai,
  SiMocha,
  SiBootstrap,
  SiExpo,
  SiMaterialui,
  SiReactrouter,
  SiReacttable,
  SiSemanticuireact,
  SiNextdotjs,
  SiStripe,
  SiElectron,
  SiTypescript,
  SiFirebase,
  SiMongodb,
  SiRealm,
  SiPassport,
  SiExpress,
  SiRedis,
  SiFramer,
  SiVuetify,
  SiVuedotjs,
  SiTailwindcss,
  SiBabel,
} from "react-icons/si";

const ICONS_DATA: {
  [key: string]: IconType;
} = {
  react: SiReact,
  "@chakra-ui/vue": SiChakraui,
  "@chakra-ui/react": SiChakraui,
  chai: SiChai,
  mocha: SiMocha,
  bootstrap: SiBootstrap,
  expo: SiExpo,
  "@mui/material": SiMaterialui,
  "@material-ui/core": SiMaterialui,
  "react-router-dom": SiReactrouter,
  "react-table": SiReacttable,
  "semantic-ui-react": SiSemanticuireact,
  next: SiNextdotjs,
  stripe: SiStripe,
  typescript: SiTypescript,
  electron: SiElectron,
  firebase: SiFirebase,
  "@react-native-firebase/app": SiFirebase,
  mongodb: SiMongodb,
  "framer-motion": SiFramer,
  passport: SiPassport,
  realm: SiRealm,
  express: SiExpress,
  redis: SiRedis,
  vue: SiVuedotjs,
  vuetify: SiVuetify,
  tailwindcss: SiTailwindcss,
  "@babel/core": SiBabel,
  "@babel/runtime": SiBabel,
};

export default ICONS_DATA;
