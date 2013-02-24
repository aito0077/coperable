package org.coperable.engine.boot;

//import akka.config.TypedActorConfigurator;
//import static akka.config.Supervision.*;

import org.apache.camel.CamelContext;

import org.springframework.context.support.ClassPathXmlApplicationContext;
import org.springframework.context.support.AbstractApplicationContext;

public class Boot {

 //   public final static TypedActorConfigurator configurator = new TypedActorConfigurator();

    public Boot() {
        System.out.println("Arrancando...");
        try {
            ClassPathXmlApplicationContext context = new ClassPathXmlApplicationContext(new String[] {"/context-standalone.xml"}, false);
            context.setClassLoader(getClass().getClassLoader());
            context.refresh();
            context.start();
         } catch(Exception ex) {
            ex.printStackTrace();
        }
    }

}
