import z from 'zod';

export const symptomsSchema = z.object({
  suffocate: z.boolean({ invalid_type_error: 'Suffocate must be a boolean', required_error: 'Suffocate is required' }),
  cough: z.boolean({ invalid_type_error: 'Cough must be a boolean', required_error: 'Cough is required' }),
  mucus: z.boolean({ invalid_type_error: 'Mucus must be a boolean', required_error: 'Mucus is required' }),
  congestion: z.boolean({ invalid_type_error: 'Congestion must be a boolean', required_error: 'Congestion is required' }),
  throat: z.boolean({ invalid_type_error: 'Throat must be a boolean', required_error: 'Throat is required' }),
  fever: z.boolean({ invalid_type_error: 'Fever must be a boolean', required_error: 'Fever is required' }),
  chest_pain: z.boolean({ invalid_type_error: 'Chest pain must be a boolean', required_error: 'Chest pain is required' }),
  whistle: z.boolean({ invalid_type_error: 'Whistle must be a boolean', required_error: 'Whistle is required' }),
  malaise: z.boolean({ invalid_type_error: 'Malaise must be a boolean', required_error: 'Malaise is required' })
});
