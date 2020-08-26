import { pathToRegexp } from "path-to-regexp";
import mocks from '@/mocks';
import schema from '@/mocks/schema'
// maintain cache of path strings to mocked response object that is returne

const HTTP_METHODS = ['GET', 'POST', 'PUT', 'DELETE']

class MockHttpClient {

    _mockedDomain = null

    _regexToMockedResponse = {
        GET: [],    // [{ regex: xxx, pathParamKeys: [string], mockCallback: Function }]
        POST: [],
        PUT: [],
        DELETE: []
    }

    _schema = null

    constructor(mockedDomain){
         for (let [mockModuleName, mockHttpModule] of Object.entries(mocks)) {
            mockHttpModule.routes()
            this._deconstructMockedHttpModule(mockHttpModule)
         }
         this._schema = schema
         this._mockedDomain = mockedDomain      //mockedDomain should be the domain of your host, e.g. www.example.com
    }

    /**
     * It should be able extract the query params and put into request object
     * @param {*} path 
     */
    get(path){
        return new Promise((resolve, reject) => {
            let response = {
                data: this._mockRequest('GET', path, requestBody)
            }
            resolve(response)
        })
    }

    post(path, requestBody) {
        return new Promise((resolve, reject) => {
            let response = {
                data: this._mockRequest('POST', path, requestBody)
            }
            resolve(response)
        })
    }

    put(path, requestBody) {
        return new Promise((resolve, reject) => {
            let response = {
                data: this._mockRequest('PUT', path, requestBody)
            }
            resolve(response)
        })
    }

    delete(path) {
        return new Promise((resolve, reject) => {
            let response = {
                data: this._mockRequest('DELETE', path)
            }
            resolve(response)
        })
    }

    /**
     * Drill down into the mock modules
     * @param {*} mockHttpModule 
     */
    _deconstructMockedHttpModule(mockHttpModule) {
        for (let [httpMethod, mockHttpRequests] of Object.entries(mockHttpModule)) {
            if (!HTTP_METHODS.includes(httpMethod)) continue;
            this._cacheHttpRequests(httpMethod, mockHttpRequests)
        }
    }

    /**
     * Parse the mocked http path into a regular expression. Cache the regular expression alongside the path param keys and the mocked callback
     * @param {*} mockHttpRequests 
     */
    _cacheHttpRequests(httpMethod, mockHttpRequests) {
        for (let [mockedPath, mockCallback] of Object.entries(mockHttpRequests)) {
            if (mockedPath.charAt(0) != '/') mockedPath = '/' + mockedPath;
            const keys = []
            const regexp = pathToRegexp(mockedPath, keys);
            let cachedHttpRequest = {
                regexp: regexp,
                pathParamKeys: keys,
                mockCallback: mockCallback
            }
            this._regexToMockedResponse[httpMethod].push(cachedHttpRequest)
        }

    }
    
    /**
     * Breakdown the path
     * Construct request object with query parameters and path parameters. Also return the mock callback
     * @param {*} path 
     */
    _mockRequest(httpMethod, path, requestBody){
        let request = {}
        if (path.charAt(0) != '/') path = '/' + path;
        let fakeUrl = this._mockedDomain + path;
        let url = new URL(fakeUrl)

        let pathParamsAndMockCallback = this._extractPathParams(httpMethod, url)
        if (pathParamsAndMockCallback == null) {
            console.log('Did not find a mocked http path that matched');
            console.log('HTTP Method: '+ httpMethod, 'HTTP Request: ' + url.href )
            return this._passthrough(httpMethod, url)
        } 
        request['pathParams'] = pathParamsAndMockCallback.pathParams
        request['queryParams'] = this._extractQueryParams(url)
        if (requestBody) request['requestBody'] = JSON.stringify(requestBody)       //may need to implement a check against request body for whether it is JSON or binary
        let mockCallback = pathParamsAndMockCallback.mockCallback
        return mockCallback(this._schema, request)
    }

    /**
     * Extract the query parameters of the URL
     * @param {*} url 
     */
    _extractQueryParams(url){
        let queryParams = {}
        for (let [queryKey, queryValue] of url.searchParams.entries()) {
            queryParams[queryKey] = queryValue
        }
        return queryParams
    }

    /**
     * Extract the path parameters of the URL
     * @param {*} url 
     */
    _extractPathParams(httpMethod, url){
        let regexResult = null
        let keys = null
        let mockCallback = null
        for (let cachedMockRequest of this._regexToMockedResponse[httpMethod]) {
            regexResult = cachedMockRequest.regexp.exec(url.pathname)
            if (regexResult != null) {
                keys = cachedMockRequest.pathParamKeys
                mockCallback = cachedMockRequest.mockCallback
                break;
            }
        }
        if (regexResult == null){
            return null
        } 

        let pathParams = {}
        for (let keyIndex = 0; keyIndex < keys.length; keyIndex ++) {
            pathParams[keys[keyIndex].name] = regexResult[keyIndex + 1]
        }

        return {pathParams, mockCallback}
    }

    /**
     * If you want the request to passthrough, implement behaviour here
     * @param {*} httpMethod 
     * @param {*} url 
     */
    _passthrough(httpMethod, url){
        return
    }

}

const mockHttpClient = new MockHttpClient()
export default mockHttpClient;