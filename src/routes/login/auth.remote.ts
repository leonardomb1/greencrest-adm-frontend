import * as v from 'valibot';
import { command, getRequestEvent } from '$app/server';
import { api } from '$lib/server/api';

export const login = command(
    v.object({
        email: v.pipe(v.string(), v.email()),
        password: v.pipe(v.string(), v.nonEmpty())
    }),
    async ({email, password}) => {
        const res = await api('/users/login', {
            method: 'POST',
            headers: {
                'Content-Type' : 'application/json'
            },
            body: JSON.stringify({email, password})
        });

        if (!res.ok) {
            throw new Error('Invalid credentials.')
        }

        const data = await res.json();

        const { cookies } = getRequestEvent();
        cookies.set('token', data.token, {
            path: '/',
            httpOnly: true,
            secure: true,
            sameSite: 'strict',
            maxAge: 60 * 60 * 24
        })

        return { success: true }
    }
)