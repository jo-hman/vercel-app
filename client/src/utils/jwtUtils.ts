export interface JwtPayload {
    exp: number;
    name: string;
}

export const extractJwtPayload = (jwt: string | null): JwtPayload => {
    return jwt && JSON.parse(atob(jwt.split('.')[1]));
}

export const jwtLocalStorageKey = 'accessCode';