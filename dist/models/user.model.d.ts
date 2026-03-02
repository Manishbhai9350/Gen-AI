import { Schema } from "mongoose";
export declare const UserModel: import("mongoose").Model<{
    username: string;
    email: string;
    password: string;
}, {}, {}, {
    id: string;
}, import("mongoose").Document<unknown, {}, {
    username: string;
    email: string;
    password: string;
}, {
    id: string;
}, import("mongoose").DefaultSchemaOptions> & Omit<{
    username: string;
    email: string;
    password: string;
} & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}, "id"> & {
    id: string;
}, Schema<any, import("mongoose").Model<any, any, any, any, any, any, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, {
    username: string;
    email: string;
    password: string;
}, import("mongoose").Document<unknown, {}, {
    username: string;
    email: string;
    password: string;
}, {
    id: string;
}, import("mongoose").DefaultSchemaOptions> & Omit<{
    username: string;
    email: string;
    password: string;
} & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}, "id"> & {
    id: string;
}, {
    [path: string]: import("mongoose").SchemaDefinitionProperty<undefined, any, any>;
} | {
    [x: string]: import("mongoose").SchemaDefinitionProperty<any, any, import("mongoose").Document<unknown, {}, {
        username: string;
        email: string;
        password: string;
    }, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<{
        username: string;
        email: string;
        password: string;
    } & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
}, {
    username: string;
    email: string;
    password: string;
} & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}>, {
    username: string;
    email: string;
    password: string;
} & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}>;
//# sourceMappingURL=user.model.d.ts.map