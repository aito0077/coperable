coperable
=========

Coperable - Sitio de grandes ideas y pequeños pasos

El sistema consiste en un servidor de servicios REST (coperable-api), en NodeJs, que se conecta a una base de datos NoSql MongoDb. En un servidor web (coperable-site), que provee los recursos propios (estilos, js, imagenes), renderiza el html, manejo de las API externas (facebook, twitter, amazon, etc) y se conecta al servidor de servicios.

La idea de un servidor de servicios es que pueda ser consumido desde otras plataformas (mobile, sitios externos, aplicaciones, etc). Ademas nos permite poder integrar en un futuro otro tipo de servidores, sin necesidad de modificar nada (Analisis de Datos (Storm), Servidor de reglas (Drools), etc.

Las tecnologías con las que estamos desarrollando son:

Node: (http://nodejs.org) - En este link (https://github.com/joyent/node/wiki/modules) pueden ver la variedad de módulos que se pueden integrar para diversas cosas. Sin ser desarrolladores pueden ver qué tipo de tecnologías podemos integrar (chat, video, imagen, wikis, etc). Todo, tanto del cliente como del lado del servidor se programa usando javascript.

Bootstrap: (http://twitter.github.com/bootstrap/index.html) Es un framework de diseño que es totalmente responsive.

Backbone: http://backbonejs.org/ Desde el lado del cliente. Es un framework javascript muy potente para el trabajo desde el lado del cliente. Permite manejar en el browser el patron MVC, permite renderizar fragmentos de template en runtime desde el cliente, sin necesidad de llamar al servidor, y se comunica con el servidor utilizan REST.

Como ORM para MongoDb, que mapea las colecciones con objetos, utilizamos Mongoose: http://mongoosejs.com/

Para la logica MVC del sitio, utilizamos Express.js: http://expressjs.com/

MongoDb, como base de datos: http://www.mongodb.org/

Restify, como servidor REST: http://mcavage.me/node-restify/

Passport, para servicios de autenticación de usuarios: http://passportjs.org/
