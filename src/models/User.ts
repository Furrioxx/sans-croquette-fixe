export interface User {
    id : number;
    username : string;
    email : string;
    createdAt : string;
    updatedAt : string;
}

export interface UserWithToken {
    user : User;
    token : string;
}

export interface UserLogin {
    email : string;
    password : string;
}

export interface UserPost {
    username : string;
    email : string;
    password : string;
}