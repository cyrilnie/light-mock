import {Schema} from '@/mocks/lib/schema'

let video = new Schema()

video.create({ fileId: "FILE_ID_01", filename: "sample-video.mp4", uniqueFilename: "sample-video.mp4", contentType: "CONTENT_TYPE_01", createdAt: '2020-03-21T19:10:43.699', updatedAt: '2020-03-21T19:10:43.699'})
video.create({ fileId: "FILE_ID_02", filename: "maul.mp4", uniqueFilename: "2020.03.21.19.15.45maul.mp4", contentType: "CONTENT_TYPE_01", createdAt: '2020-03-21T19:10:43.699', updatedAt: '2020-03-21T19:10:43.699'})

export default video