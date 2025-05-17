// src/types/express.d.ts
import * as express from "express";
import {Roles} from "../main/userManagement/role/RoleModel";

declare global {
    namespace Express {
        interface Request {
            _id?: string;
            permission?: Roles;
        }
    }
}
export {};