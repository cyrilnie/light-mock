export default {

    GET:{},
    POST: {},
    PUT: {},
    DELETE: {},
    get(path, callback){
        this.GET[path] = callback
    },
    post(path, callback){
        this.POST[path] = callback
    },
    put(path, callback){
        this.PUT[path] = callback
    },
    delete(path, callback){
        this.DELETE[path] = callback
    },

    routes() {

        this.get('/example', function(schema, request) {
            return {
                id: "EXAMPLE_ID",
                example: "THIS IS AN EXAMPLE" ,
                date: new Date(),
            }
        })

        this.get('example/video', function(schema, request) {
            let videos = schema.video.all()
            
            let json = {
              content: JSON.parse(JSON.stringify(videos))
            }
            json.totalPages = 1
            return json
        })

        this.put('example', function(schema, request) {
            return
        })

        this.post('/example/video', function(schema, request) {
            const newVideo = schema.video.create({
                fileId: "FILE_ID_03",
                filename: "sample-video.mp4",
                uniqueFilename: "sample-video.mp4",
                contentType: "CONTENT_TYPE_03",
                createdAt: new Date(),
                updatedAt: new Date()
            })
            return {
                content: JSON.parse(JSON.stringify(newVideo))
            };
        })

        this.delete('example/video/:fileId', function(schema, request) {
            const video = schema.video.findBy({ fileId: request.pathParams.fileId});
            video.destroy();
        })


    }
    
}

