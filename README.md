https://travis-ci.com/medinamarquezp/graphql-prismav2-demo.svg?branch=master

# graphql-prismav2-demo

### EL proyecto
Esta demo tiene como único objetivo probar graphql-yoga y prisma-v2 para la realización de una simple API GraphQL. La API estará compuesta por los siguientes nodos:

![graph-diagram](https://raw.githubusercontent.com/medinamarquezp/graphql-prismav2-demo/master/docs/diagrams/out/src/graph/graph.png "GraphQL UML diagram")

La gestión de usuarios, autenticación y autorización se realizará utilizando JWT. Los usuarios podrán crear listas públicas y privadas y estás a su vez estarán compuestas por tareas.

### Prisma V2
La versión 2 de Prisma ha evolucionado muchísimo y algunas de sus funcionalidades aún se encuentran en fase experimental. Para la realización de esta demo trabajaré con varias bases de datos SQLite, cada una de estas segmentadas por entornos: test, dev y prod.

Para una gestión más ágil de las funcionalidades de Prisma he creado los siguientes comandos npm:

- generate:db --dbname: Este comando me permite generar los ficheros de las BBDD. El parámetro dbname especifica el nombre de la BBDD.
- prisma:generate --env: Comando para la generación del cliente de Prisma. Recibe por parámetro el entorno.
- prisma:migrate:save --env --name: Migrate es un comando en fase experimental que permite generar migraciones de la BBDD basadas en el fichero schema.prisma. Recibe por parámetro el entorno y el nombre de la migración.

[Más información sobre prisma-v2](https://www.prisma.io/docs/)
