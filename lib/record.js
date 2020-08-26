export class Record { 

    _map = new Map()
    _schema = null

    constructor(recordObject, schema){
        this._schema = schema
        for (let [attribute, value] of Object.entries(recordObject)) {
            this._map.set(attribute, value)
            this[attribute] = value
        }
    }

    save(){
        this._schema.registerRecord(this)
    }
    
    update({updatedAttribute, updatedValue}){
        if (!this._map.has(updatedAttribute)) {
            throw new Error('Mock update failed. Attribute to update does not exist on record.');
        }
        this[updatedAttribute] = updatedValue
        this._map.set(updatedAttribute, updatedValue)
    }

    destroy() {
        this._schema.removeRecord(this)
    }

    toJSON(){
        let jsonObject = {}
        this._map.forEach((value, attribute) => {
            jsonObject[attribute] = value
        })
        return jsonObject
    }

}