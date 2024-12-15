import z from 'zod';

export const testsSchema = z.object({
  username: z.string({ invalid_type_error: 'Username must be a string', required_error: 'Username is required' }).max(50, { length_exceeded: 'Username must be at most 50 characters long' }),
  analitic: z.string({ invalid_type_error: 'Analitic must be a string', required_error: 'Analitic is required' }).min(10, { minimum: 'Analitic must be at least 10 characters long' }),
  gasometry: z.string({ invalid_type_error: 'Gasometry must be a string', required_error: 'Gasometry is required' }).min(10, { minimum: 'Gasometry must be at least 10 characters long' }),
  ecg: z.string({ invalid_type_error: 'ECG must be a string', required_error: 'ECG is required' }).min(10, { minimum: 'ECG must be at least 10 characters long' }),
  torax: z.string({ invalid_type_error: 'Torax must be a string', required_error: 'Torax is required' }).min(10, { minimum: 'Torax must be at least 10 characters long' })
});

export const tests2Schema = z.object({
  username: z.string({ invalid_type_error: 'Username must be a string', required_error: 'Username is required' }).max(50, { length_exceeded: 'Username must be at most 50 characters long' }),
  micro: z.string({ invalid_type_error: 'Micro must be a string', required_error: 'Micro is required' }).min(10, { minimum: 'Micro must be at least 10 characters long' }),
  antigenuria: z.string({ invalid_type_error: 'Antigenuria must be a string', required_error: 'Antigenuria is required' }).min(10, { minimum: 'Antigenuria must be at least 10 characters long' }),
  hemo: z.string({ invalid_type_error: 'Hemo must be a string', required_error: 'Hemo is required' }).min(10, { minimum: 'Hemo must be at least 10 characters long' }),
  pcr: z.string({ invalid_type_error: 'PCR must be a string', required_error: 'PCR is required' }).min(10, { minimum: 'PCR must be at least 10 characters long' })
});
