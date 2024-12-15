import z from 'zod';

export const testsSchema = z.object({
  username: z.string({ invalid_type_error: 'Username must be a string', required_error: 'Username is required' }).max(50, { length_exceeded: 'Username must be at most 50 characters long' }),
  analitic: z.string({ invalid_type_error: 'Analitic must be a string', required_error: 'Analitic is required' }).min(10, { minimum: 'Analitic must be at least 10 characters long' }),
  gasometry: z.string({ invalid_type_error: 'Gasometry must be a string', required_error: 'Gasometry is required' }).min(10, { minimum: 'Gasometry must be at least 10 characters long' }),
  ecg: z.string({ invalid_type_error: 'ECG must be a string', required_error: 'ECG is required' }).min(10, { minimum: 'ECG must be at least 10 characters long' }),
  torax: z.string({ invalid_type_error: 'Torax must be a string', required_error: 'Torax is required' }).min(10, { minimum: 'Torax must be at least 10 characters long' })
});
