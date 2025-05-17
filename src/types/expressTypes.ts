// src/types/express.d.ts
import * as express from "express";
import {RolePermission} from "../main/userManagement/role/RoleModel";

declare global {
    namespace Express {
        interface Request {
            _id?: string;
            permission?: RolePermission[];
        }
    }
}
export {};