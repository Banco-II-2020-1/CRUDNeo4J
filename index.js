require('dotenv').config();
const neo4j = require('neo4j-driver');

const uri = `neo4j://${process.env.NEO4J_HOST}:${process.env.NEO4J_PORT}`;
const driver = neo4j.driver(uri, neo4j.auth
    .basic(process.env.NEO4J_USER, process.env.NEO4J_PASSWORD));
const session = driver.session();

async function addPessoa(obj){
    try{
        const query = `CREATE (p:Pessoa{nome:"${obj.nome}", email:"${obj.email}"}) RETURN p`;
        await session.run(query).then(result => console.log(result.records[0].length>0));
    }finally{
        await session.close();
    }
}

async function addAmizade(email1, email2){
    try{
        const query = `MATCH (p1:Pessoa), (p2:Pessoa) 
            WHERE p1.email="${email1}" AND p2.email="${email2}"
            CREATE (p1)-[:AMIGO]->(p2)`;
        await session.run(query).then(result => console.log(
            result.summary.counters._stats.relationshipsCreated));
    } finally{
        await session.close();
    }
}

async function updatePessoa(){
    try{
        const query = `MATCH (p:Pessoa{email:"paulo.freitas@gmail.com"}) 
            SET p.email="paulo@gmail.com"`;
        await session.run(query).then(result => console.log(
            result.summary.counters._stats.propertiesSet));
    }finally{
        await session.close();
    }
}

async function deletePessoa(email){
    try{
        const query = `MATCH (p:Pessoa{email:"${email}"}) DETACH DELETE p`;
        await session.run(query).then(result => console.log(
            result.summary.counters._stats.nodesDeleted));
    }finally{
        await session.close();
    }
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

// deletePessoa("paulo.freitas.nt@gmail.com");