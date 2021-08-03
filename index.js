require('dotenv').config();
const neo4j = require('neo4j-driver');

const uri = `neo4j://${process.env.NEO4J_HOST}:${process.env.NEO4J_PORT}`;
const driver = neo4j.driver(uri, neo4j.auth
    .basic(process.env.NEO4J_USER, process.env.NEO4J_PASSWORD));
const session = driver.session();

async function addPessoa(obj){
    await session.run('CREATE (p:Pessoa{nome:$nome, email:$email}) RETURN p',{
        nome: obj.nome,
        email: obj.email
        }).then(result => console.log(result.records[0].length>0))
        .catch(error => console.log(error))
        .then(session.close);
}

async function addAmizade(email1, email2){
    await session.run('MATCH (p1:Pessoa), (p2:Pessoa) WHERE p1.email=$email1 AND p2.email=$email2 CREATE (p1)-[:AMIGO]->(p2)',
        {email1: email1, email2:email2})
        .then(result => console.log(result.summary.counters._stats.relationshipsCreated))
        .catch(error => console.log(error))
        .then(session.close);
}

async function updatePessoa(){
    await session.run('MATCH (p:Pessoa{email:$email}) SET p.email=$email2',
        {email:'paulo.freitas@gmail.com', email2:'paulo@gmail.com'})
        .then(result => console.log(result.summary.counters._stats.propertiesSet))
        .catch(error => console.log(error))
        .then(session.close);
}

async function deletePessoa(email){
    await session.run('MATCH (p:Pessoa{email:$email}) DETACH DELETE p',
        {email:email})
        .then(result => console.log(result.summary.counters._stats.nodesDeleted))
        .catch(error => console.log(error))
        .then(session.close);
}

// const obj = {
//     nome: "Paulo Freitas",
//     email: "paulo.freitas@gmail.com"
// };
// addPessoa(obj);

// const obj = {
//     nome: "Maria da Silva",
//     email: "maria@gmail.com"
// }
// addPessoa(obj);

// addAmizade("paulo.freitas@gmail.com", "maria@gmail.com");

// updatePessoa();

// deletePessoa("paulo@gmail.com");