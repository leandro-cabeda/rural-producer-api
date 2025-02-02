# Objetivo desta aplicação api

O objetivo é criar uma aplicação para gerenciar o cadastro de produtores rurais com alguns dados fornecidos.

## Começando

- git clone desse repositorio
- npm i para instalar as dependencias
- ajustar os arquivos dockerfile, docker composer, app.module com base nas informações que necessita para cada usuario.
- npm start  para startar a aplicação back
- subir um container docker para sicronizar no banco postgresql e com isso api terá acesso para salvar os dados no banco.

## Docker iniciar
- Abre o docker na maquina para que inicie
- docker compose up -d  => execute esse comando, ele vai criar 2 containers
- Um container para o PostgreSQL (db).
- Um container para a API NestJS (api).
- Adicione um arquivo .env na raiz do projeto e adicione => DATABASE_URL=postgresql://admin:admin@db:5432/rural_producer
- Se quiser desligar ou remover os containers, basta executar esse comando =>  docker compose down

# Observação importante
- Se executar o docker para subir o container da Api, precisa ir no arquivo app.module para alterar o host da conexão do banco de dados.


## Interface Swagger da Api URL Local
- Acesse (http://localhost:3000/api) depois que subir a aplicação


## Interface Swagger da Api URL Online pelo Render Plataforma
- https://rural-producer-api.onrender.com/api
