import z from 'zod';

export const userSchema = z.object({
  username: z.string({ invalid_type_error: 'Username must be a string' })
    .max(50, { length_exceeded: 'Username must be at most 50 characters long' })
    .nonempty({ required_error: 'Username is required' }),
  password: z.string({ invalid_type_error: 'Password must be a string' })
    .max(100, { length_exceeded: 'Password must be at most 100 characters long' })
    .nonempty({ required_error: 'Password is required' })
});
