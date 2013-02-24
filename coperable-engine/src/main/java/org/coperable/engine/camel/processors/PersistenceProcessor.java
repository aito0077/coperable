package org.coperable.engine.camel.processors;

import org.springframework.beans.factory.annotation.Autowired;
//import org.springframework.data.document.mongodb.MongoTemplate;
import org.springframework.stereotype.Repository;

import com.mongodb.DBCollection;

import org.apache.camel.Exchange;
import org.apache.camel.Processor;

//import org.coperable.engine.persistence.domain.*;

//@Repository
public class PersistenceProcessor implements Processor {
	
    /*
	@Autowired
	MongoTemplate mongoTemplate;
    */

	public void process(Exchange exchange) throws Exception {
		

        /*
		String name = exchange.getIn().getHeader("name", String.class);
		String age = exchange.getIn().getHeader("age", String.class);
		String account_number = exchange.getIn().getHeader("account", String.class);
		String amount = exchange.getIn().getHeader("amount", String.class);
        */
		
        /*
		Person person = persist("Leonardo", "33", "31241", "345.32");
        exchange.getOut().setHeader("ENTITY_ID", person.getId());
        exchange.getOut().setBody(person);
        */
		
	//	exchange.getOut().setHeader(MessageConstants.PROCESS_ID, processId);
	}

    /*
	public Person persist(String name, String age, String account_number, String amount) {
        System.out.println("AITO: DEBUG: Nombre: "+name+" - Age: "+age+" - Account: "+account_number+" - Amount: "+amount);

		if (mongoTemplate.getCollectionNames().contains("HelloMongo")) {
			mongoTemplate.dropCollection("HelloMongo");
		}
		
		mongoTemplate.createCollection("HelloMongo");

		Person p = new Person(name, Integer.parseInt(age));
		Account a = new Account(account_number, Account.Type.SAVINGS, Double.parseDouble(amount));
		p.getAccounts().add(a);
		
        mongoTemplate.insert(p);
		System.out.println("AITO: DEBUG: person id: " + p.getId());
        return p;
	}
    */

}
