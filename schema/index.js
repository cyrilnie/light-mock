/**
 * Automatically imports all the schemas and exports as a single schema object
 */

const requireSchemas = require.context('.', false,  /\.schema\.js$/);
const schema = {};

requireSchemas.keys().forEach(filename => {

    const schemaName = filename
        .replace(/(\.\/|\.schema\.js)/g, '')

        schema[schemaName] = requireSchemas(filename).default || requireSchemas(filename);
});
                
export default schema;