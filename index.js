/**
 * Automatically imports all the mocks and exports as a single mock object
 */

const requireMocks = require.context('.', false,  /\.mocks\.js$/);
const mocks = {};

requireMocks.keys().forEach(filename => {

    const mockName = filename
        .replace(/(\.\/|\.mocks\.js)/g, '')

        mocks[mockName] = requireMocks(filename).default || requireMocks(filename);
});
                
export default mocks;