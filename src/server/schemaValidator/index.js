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

schema.tags = {};

schema.tags.create = {
    type: 'object',
    required: ['name'],
    properties: {
        name: {
            type: 'string',
        },

    },
};

schema.tags.update = {
    type: 'object',
    required: ['id', 'name'],
    properties: {
        id: {
            type: 'number',
        },
        name: {
            type: 'number',
        },

    },
};

schema.tags.delete = {
    type: 'object',
    required: ['id'],
    properties: {
        id: {
            type: 'number',
        },

    },
};

export default schema;
