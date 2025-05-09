import {config} from "dotenv";
config();

import SmsApplication from "./main/SmsApplication";
SmsApplication.start();