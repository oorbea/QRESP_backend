import z from 'zod';

export const historySchema = z.object({
  mpid: z.string({ invalid_type_error: 'MPID must be a string', required_error: 'MPID is required' })
    .max(255, { length_exceeded: 'MPID must be at most 255 characters long' }),

  ttm_base: z.string({ invalid_type_error: 'TTM base must be a string', required_error: 'TTM base is required' })
    .max(255, { length_exceeded: 'TTM base must be at most 255 characters long' }),

  immuno: z.boolean({ invalid_type_error: 'Immuno must be a boolean', required_error: 'Immuno is required' }),

  comorbi: z.string({ invalid_type_error: 'Comorbi must be a string', required_error: 'Comorbi is required' })
    .max(255, { length_exceeded: 'Comorbi must be at most 255 characters long' })
});
