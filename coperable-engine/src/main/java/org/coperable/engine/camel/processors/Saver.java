package org.coperable.engine.camel.processors;

import com.mongodb.*;
import com.mongodb.util.*;
import org.bson.types.ObjectId;

import org.apache.camel.Exchange;
import org.apache.camel.Processor;

public class Saver implements Processor {
	
	Mongo mongo;
    DB db;
    String dbName;

	public void process(Exchange exchange) throws Exception {
		
        String type = exchange.getIn().getHeader("TYPE", String.class);
        String id = exchange.getIn().getHeader("ID", String.class);

		String entityJsonString = exchange.getIn().getBody(String.class);

        DBCollection collection = getDB().getCollection(type);
        DBObject dbObject = (DBObject) JSON.parse(entityJsonString);

        System.out.println("ID obtenido: "+id);
        if(id != null) {
            BasicDBObject idObj = new BasicDBObject( "_id", new ObjectId(id));
            dbObject.put("_id", idObj);
            collection.save(dbObject);
        } else {
            collection.insert(dbObject);
            id = (String) dbObject.get("_id").toString();
            System.out.println("ID insertado: "+id);
        }

        DBObject dbObjectForSearch  = (DBObject) JSON.parse(entityJsonString);
        dbObjectForSearch.put("id", id);
        System.out.println("Entity ID: "+id+" - Type: "+type);
        exchange.getOut().setHeader("ENTITY_ID", id);
        exchange.getOut().setHeader("ENTITY_TYPE", type);
        exchange.getOut().setBody(dbObjectForSearch.toString());
		
	}

    public void setDbName(String dbName) {
        this.dbName = dbName;
    }
    
    public String getDbName() {
        return this.dbName;
    }
    
    public DB getDB() {
        if(db == null) {
            db = mongo.getDB(getDbName());
        }   
        return db;
    }

    public void setMongo(Mongo mongo) {
        this.mongo = mongo;
    }

    public Mongo getMongo() {
        return this.mongo;
    }

}
