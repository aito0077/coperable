package org.coperable.engine.camel.processors.authentication;

import com.mongodb.*;
import com.mongodb.util.*;
import org.bson.types.ObjectId;

import org.apache.camel.Exchange;
import org.apache.camel.Processor;

public class Authenticate implements Processor {
	
	Mongo mongo;
    DB db;
    String dbName;

	public void process(Exchange exchange) throws Exception {
		
        String email = exchange.getIn().getHeader("EMAIL", String.class);
        String password = exchange.getIn().getHeader("PASSWORD", String.class);

        System.out.println("AITO: DEBUG: Autenticando usuario '"+email+"' cuyo password es '"+password+"'.");

        BasicDBObject query = new BasicDBObject();
        query.put("email", email);
        query.put("password", password);

        BasicDBObject document = (BasicDBObject) getDB().getCollection("USER").findOne(query);
        if(document == null) {
            System.out.println("AITO: DEBUG: El usuario NO existe.");
            exchange.getOut().setBody("{\"error\":\"El usuario no existe\"}");
        } else {
            System.out.println("AITO: DEBUG: El usuario existe.");
            ObjectId id = (ObjectId)document.get( "_id" );
            document.put("id", id.toString());
            exchange.getOut().setBody(document.toString());
        }

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
