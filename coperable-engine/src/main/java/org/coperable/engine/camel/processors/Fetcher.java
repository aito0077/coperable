package org.coperable.engine.camel.processors;

import com.mongodb.*;
import com.mongodb.util.*;
import org.bson.types.ObjectId;

import org.apache.camel.Exchange;
import org.apache.camel.Processor;

public class Fetcher implements Processor {
	
	Mongo mongo;
    DB db;
    String dbName;

	public void process(Exchange exchange) throws Exception {
		
        String id = exchange.getIn().getHeader("ID", String.class);
        String type = exchange.getIn().getHeader("TYPE", String.class);

        System.out.println("AITO: DEBUG: Obtener objeto del tipo '"+type+"' cuyo id es '"+id+"'.");

        BasicDBObject idObj = new BasicDBObject( "_id", new ObjectId(id));
        BasicDBObject document = (BasicDBObject) getDB().getCollection(type).findOne(idObj);

        exchange.getOut().setBody(document.toString());

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
