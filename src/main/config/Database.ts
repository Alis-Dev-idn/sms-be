import mongoose, {ObjectId} from 'mongoose';
import UserService from "../userManagement/user/UserService";
import RoleService from "../userManagement/role/RoleService";
import {RolePermission} from "../userManagement/role/RoleModel";

export const IdValidate = (id: string): boolean => {
    return mongoose.Types.ObjectId.isValid(id);
}

class Database {
    private uri: string;
    private username: string;
    private password: string;

    constructor() {
        this.username = process.env.SERVER_MONGODB_USER || "root";
        this.password = process.env.SERVER_MONGODB_PASSWORD || "root";
        this.uri = process.env.SERVER_MONGODB_URI || "mongodb://localhost:27017/";
    }

    private async checkDb(): Promise<void> {
        try {
            const numberUser = await UserService.getTotalUser();
            const numberRole = await RoleService.getTotalRole();
            if (numberRole === 0) {
                const role = await RoleService.createRole({
                    name: "Admin",
                    menuId: [],
                    permissions: [RolePermission.WRITE, RolePermission.READ, RolePermission.UPDATE, RolePermission.DELETE]
                });
                if (numberUser === 0) {
                    await UserService.createUser({
                        fullName: process.env.DEFAULT_ACCOUNT_FULLNAME || "Admin",
                        userName: process.env.DEFAULT_ACCOUNT_USERNAME || "admin",
                        password: process.env.DEFAULT_ACCOUNT_PASSWORD || "admin123456",
                        roleId: role._id as ObjectId,
                    });
                }
            }
        } catch (error) {
            console.log("Error: ", error);
        }
    }

    public connect(server: () => void): void {
        mongoose.connect(this.uri, {
            auth: {
                username: this.username,
                password: this.password
            }
        }).then(async () => {
            console.log('Connected to database')
            await this.checkDb();
            server();
        })
            .catch((err: Error) => {
                console.error('Error connecting to database:', err);
                process.exit(1);
            })
    }
}

export default new Database();