import * as v from 'valibot';
import { getRequestEvent, query, command } from "$app/server";
import { api } from "$lib/server/api";
import { error } from "@sveltejs/kit";

interface UserCreation {
    firstName: string,
    lastName: string,
    email: string,
    password: string,
    role: string | undefined
}

export const getUsers = query(async () => {
    const { locals } = getRequestEvent();

    if(!locals.token) {
        error(401, 'Not authenticated');
    }

    const res = await api('/users', {
        headers: {
            Authorization: `Bearer ${locals.token}`
        }
    });

    return await res.json();
});

export const createUser = command(
    v.object({
        firstName: v.pipe(v.string(), v.nonEmpty()),
        lastName: v.pipe(v.string(), v.nonEmpty()),
        email: v.pipe(v.string(), v.email()),
        password: v.pipe(v.string(), v.nonEmpty()),
        role: v.string()
    }),
    async (data: UserCreation) => {
        const { locals } = getRequestEvent();

        if (!locals.token) {
            error(401, 'Not authenticated');
        }

        const res = await api('/users', {
            method: 'POST',
            headers: {
                'Content-Type' : 'application/json',
                Authorization: `Bearer ${locals.token}`
            },
            body: JSON.stringify(data)
        });
        
        if (!res.ok) {
            let failed = await res.json();
            throw new Error(failed.error);
        }

        return await res.json();
    }
)