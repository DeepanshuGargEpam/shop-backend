export default {
    type: 'object',
    properties: {
      title: { type: 'string' },
      description: { type: 'string' },
      price: { type: 'number' },
      image: { type: 'string' },
      category: { type: 'string' },
      count: { type: 'number' },
    },
    required: ['title', 'description', 'price', 'count'],
  } as const;
  