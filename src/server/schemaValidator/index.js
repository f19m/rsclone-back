const schema = {};

schema.categories = {};

schema.categories.create = {
    type: 'object',
    required: ['name', 'type', 'icoUrl'],
    properties: {
        name: {
            type: 'string',
        },
        type: {
            type: 'number',
        },
        plan: {
            type: 'number',
        },
        summa: {
            type: 'number',
        },
        icoUrl: {
            type: 'string',
        },
    },
};

schema.categories.update = {
    type: 'object',
    required: ['id'],
    properties: {
        id: {
            type: 'number',
        },
    },
};

export default schema;
