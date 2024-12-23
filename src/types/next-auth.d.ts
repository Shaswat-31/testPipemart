import { UserRole } from "@/model/User";
import "next-auth";
import { DefaultSession } from "next-auth";

declare module 'next-auth' {
    interface User {
        _id: string;
        email: string;
        role: UserRole;
        selectsite?:string;
    }
    interface selectsite {
        language: string;
        country: string;
        url: string;
        slug: string;
        wordpress_id: string;
    }
    
    interface Session {
        user: User & DefaultSession['user']
        selectsite: selectsite;
    }
}

// Second way
declare module 'next-auth/jwt' {
    interface JWT {
        _id: string;
        email: string;
        role: UserRole;
    }
}