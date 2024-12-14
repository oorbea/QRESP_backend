import z from 'zod';

export const patientSchema = z.object({
  username: z.string({ invalid_type_error: 'Username must be a string', required_error: 'Username is required' })
    .max(50, { length_exceeded: 'Username must be at most 50 characters long' }),

  dni: z.string({ invalid_type_error: 'DNI must be a string', required_error: 'DNI is required' })
    .max(9, { length_exceeded: 'DNI must be at most 9 characters long' }),

  name: z.string({ invalid_type_error: 'Name must be a string', required_error: 'Name is required' })
    .max(50, { length_exceeded: 'Name must be at most 50 characters long' }),

  last_name: z.string({ invalid_type_error: 'Last name must be a string', required_error: 'Last name is required' })
    .max(100, { length_exceeded: 'Last name must be at most 100 characters long' }),

  birth: z.coerce.date({ invalid_type_error: 'Birth must be a date', required_error: 'Birth is required' }),

  tel: z.number({ invalid_type_error: 'Tel must be a number', required_error: 'Tel is required' })
    .int({ invalid_type_error: 'Tel must be an integer' })
    .min(100000000, { minimum: 'Tel must be at least 600000000' })
    .max(999999999, { maximum: 'Tel must be at most 999999999' }),

  gender: z.enum(['M', 'F', 'O'], {
    invalid_type_error: "Gender must be a single char ('M' for male, 'F' for female or 'O' for other)",
    required_error: 'Gender is required'
  })
});
