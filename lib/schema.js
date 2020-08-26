import {Record} from './record'

export class Schema{

    _records = []   //Array of Record

    constructor(){
    }

    create(recordObject){
        let record = new Record(recordObject, this)
        this._records.push(record)
        return record
    }

    registerRecord(record){
        this._records.push(record)
    }

    removeRecord(record) {
        this._records.splice(this._records.indexOf(record), 1)
    }

    all(){
        return this._records
    }

    /**
     * If multiple records match the given search parameters, then only the first matched record will be returned
     * Returns the first matched result
     */
    findBy(searchParam){
        let [searchAttribute, searchValue] = Object.entries(searchParam)[0]
        for (let record of this._records) {
            if (record[searchAttribute] == searchValue ){
                return record; 
            } 
        }
        
    }


}