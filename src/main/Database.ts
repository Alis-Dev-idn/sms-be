import mongoose from 'mongoose';

class Database {
    private uri: string;
    private username: string;
    private password: string;

    constructor() {
        this.username = process.env.SERVER_MONGODB_USER || "root";
        this.password = process.env.SERVER_MONGODB_PASSWORD || "root";
        this.uri = process.env.SERVER_MONGODB_URI || "mongodb://localhost:27017/";
    }

    public connect(server: () => void): void {
        mongoose.connect(this.uri, {
            auth: {
                username: this.username,
                password: this.password
            }
        }).then(() => {
            console.log('Connected to database')
            server();
        })
            .catch((err: Error) => {
                console.error('Error connecting to database:', err);
                process.exit(1);
            })
    }
}

export default new Database();