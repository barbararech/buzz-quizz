
//Variáveis Globais
//  let seusQuizzes=[1]; //Adicionei uma array aleatória para testar o botão de criar quizz - Arrumar
const conteudoHTML= document.querySelector(".conteudo") // criei pra ficar limpando o html ao inves de ligar de desligar o "escondido"
const tela1 = document.querySelector(".telaListaQuizzes");
const tela2 = document.querySelector(".telaQuizz");
const tela3 = document.querySelector(".telaInfoQuiz");
const tela4 = document.querySelector(".telaCriarPerguntas");
const tela5 = document.querySelector(".telaCriarNivel");
const tela6 = document.querySelector(".telaFimDoQuizz");
const tela7 = document.querySelector(".telaSucessoQuizz");
const listaUser= document.querySelector(".lista_User");
let listaIdsUsuario = [];
let acertouResposta=0;
let questaoRespondida=0;
let levelUsuario;
function comparador() { 
	return Math.random() - 0.5; 
}

function inicio(){
    window.location.reload(true);


let listaIdsUsuario = localStorage.getItem("listaIdsUsuarioLocalStorage");

if(listaIdsUsuario === null){
    listaIdsUsuario = [];
    let stringIds = JSON.stringify(listaIdsUsuario);
    localStorage.setItem("listaIdsUsuarioLocalStorage", stringIds);
} else{
    listaIdsUsuario = JSON.parse(localStorage.getItem("listaIdsUsuarioLocalStorage"));
}
}
//Adicionar botão de criar quizz dinamicamente
iniciarApp()
function iniciarApp(){
    tela1.classList.remove("escondido");
    listaIdsUsuario =  JSON.parse(localStorage.getItem("listaIdsUsuarioLocalStorage"));
    console.log(listaIdsUsuario)
    if (!listaIdsUsuario || listaIdsUsuario.length === 0){
        document.querySelector(".telaListaQuizzes").innerHTML += `
            <div class="criarQuizz">
                <div class="infoSemQuizz">Você não criou nenhum quizz ainda :(</div>
                <button type="button" onclick="abrirTelaInfo()">Criar Quizz</button> 
            </div>
        `
    } else{
        document.querySelector(".seusQuizes").innerHTML += `
            <section class="seusQuizzes">
                <div class="seusQuizzesHeader">
                    <h3>Seus Quizzes</h3>
                    <ion-icon id="ButtonCriarQuizz" class= "iconCriarQuizz" name="add-circle" onclick="abrirTelaInfo()"></ion-icon>
                </div>
            </section>
        `
    }
    getQuizzesId();
}

// Pegar idQuizzes dos outros
let idOutros = [];
function getQuizzesId(){
    const promise = axios.get("https://mock-api.driven.com.br/api/v6/buzzquizz/quizzes");
    promise.then(function(response){
        for (let i = 0; i < response.data.length; i++) {
            idOutros.push(response.data[i].id);
        }
        listarTodosQuizzes(response);
        // console.log(idOutros);
    });
}

// let listaIdsUsuarioMentira=[1203,1206,1275,1244];
const backgroundGradient = "linear-gradient(180deg, rgba(255, 255, 255, 0) 0%, rgba(0, 0, 0, 0.5) 64.58%, #000000 100%)";

// Listagem de todos os quizzes
function listarTodosQuizzes(response){
    // console.log(idOutros);
    // console.log(listaIdsUsuario);
    // console.log(response.data);
    let quizzes = response.data;

    document.querySelector(".telaListaQuizzes").innerHTML +=`
        <section class="todosOsQuizzes">
            <h3>Todos os Quizzes</h3>
            <div class="gradeQuizzes">
            </div>
        </section> 
    `
    if (!listaIdsUsuario){
        for(let j=0;j<quizzes.length;j++){
            document.querySelector(".gradeQuizzes").innerHTML += ` 
                <div id="${quizzes[j].id}" class="coverQuiz" onclick="getDataApi(${quizzes[j].id})">
                    <span>"${quizzes[j].title}"</span>                    
                </div>
                 `
            const quizzAtual = document.getElementById(quizzes[j].id);
            quizzAtual.style.backgroundImage = `${backgroundGradient}, url("${quizzes[j].image}")`;
        }
    } else{

        let numListaIdsUsuario = listaIdsUsuario.map(Number);
        console.log(numListaIdsUsuario);
        
        for(let j=0;j<quizzes.length;j++){
            if(!numListaIdsUsuario.includes(quizzes[j].id)){
                document.querySelector(".gradeQuizzes").innerHTML += ` 
                    <div id="${quizzes[j].id}" class="coverQuiz" onclick="getDataApi(${quizzes[j].id})">
                        <span>${quizzes[j].title}</span>                    
                    </div>
                    `
            const quizzAtual = document.getElementById(quizzes[j].id);
            quizzAtual.style.backgroundImage = `${backgroundGradient}, url("${quizzes[j].image}")`;
                console.log(!listaIdsUsuario.includes(quizzes[j].id))
            }
        }
    }

    listarQuizzesUser();
}

//Listagem de Quizzes do User
function listarQuizzesUser(){
    listaIdsUsuario.map(getQuizUser);
}

let dataQuizz;
function inserirQuizzUser(response){
    let dataQuizz = response.data;
    document.querySelector(".lista_User").innerHTML +=`
    <div class="home_quizz" onclick="getDataApi(${dataQuizz.id})">
        <img src=${dataQuizz.image} alt="Imagem principal do seu Quizz">
        <div class="blackCover"></div>
        <div class="nome_Quizz"><h2> ${dataQuizz.title} </h2></div>
    </div>
    </div>
`
}

//Exibir Quizz
let resposta;
let respostaAPI;
function exibirQuizz(response){
    respostaAPI=response
    tela1.classList.add("escondido");
    tela2.classList.remove("escondido");
    conteudoHTML.classList.add("nextTop");
    levelUsuario = response.data.levels
    const dataQuizz= response.data;
    const pergunta = dataQuizz.questions;
    
    tela2.innerHTML =`
    <div class="topo_Quiz">
        <div class="blackCover"> </div>
        <div class="img_Quiz"><img src="${dataQuizz.image}"/></div>
        <div class="titulo_Quiz"><h2>${dataQuizz.title}</h2></div>
    </div>
    <div class="render-perguntas"> </div>
    `;
    for(let i = 0 ; i<pergunta.length; i++){
        embralharRespostas(pergunta,i)
        const renderPerguntas = tela2.querySelector(".render-perguntas")
        renderPerguntas.innerHTML +=`
        <div class="question">
            <div class="caixa-pergunta" style="background-color:${pergunta[i].color}"> <h3>${pergunta[i].title}</h3> </div>
            <div class="caixa-respostas" id="pergunta${i}">     
            </div>
        </div>
        `
       
        for(let j=0; j<resposta.length; j++){
            const respostas= document.getElementById(`pergunta${i}`)
           
            respostas.innerHTML += `
            <div class="resposta ${resposta[j].isCorrectAnswer}" onclick="comportamentoRespostas(this)" > 
                <img src="${resposta[j].image}"/>
                <h4> ${resposta[j].text}</h4>
            </div>
            `
        }

    }
    setTimeout(scrollPrimeiraPergunta(),2000);
}

function embralharRespostas(pergunta,indice){
resposta = pergunta[indice].answers.sort(arrayAleatorio);
}

function arrayAleatorio() {
    return (Math.random() - 0.5);
}

function scrollPrimeiraPergunta() {
    document.querySelectorAll(".question")[0].scrollIntoView({behavior:"smooth"});
}

// Comportamento respostas
let qtdQuestoes;
function comportamentoRespostas(element){
    let respostas = element.parentNode.querySelectorAll(".resposta");
    const respostaCerta = element.parentElement.querySelector(".true")
    qtdQuestoes= document.querySelectorAll(".question");
    questaoRespondida+=1
    console.log(respostaCerta);
    console.log(element);
    
    for (let i=0;i<respostas.length;i++){
        let divRespostas = respostas[i];
        divRespostas.parentNode.classList.add("respondido")
        respostas[i].removeAttribute("onclick");

        if(divRespostas.classList.contains("true")){
            divRespostas.classList.add("colortrue");
            
        } else{
            divRespostas.classList.add("colorfalse");
        }
    
        if(element !== divRespostas){
            divRespostas.classList.add("naoselecionado");
        }
    }
    if(respostaCerta===element){
        acertouResposta+=1;
    }
    console.log(qtdQuestoes.length)
    if(questaoRespondida===qtdQuestoes.length){
       setTimeout(fimDoQuiz, 2000) 
      
    }
    scrollProxPergunta()
}

function scrollProxPergunta(){
    const perguntas = document.querySelectorAll(".question");
    // console.log(perguntas);
    for(let i=0;i<perguntas.length-1;i++){
        if(perguntas[i].lastElementChild.classList.contains("respondido")){
            perguntas[i+1].scrollIntoView({behavior:"smooth"});
        }
    }  
}

function reiniciarQuizz(){
    setTimeout(function(){
        window.scrollTo(0, 0);
        
        tela6.classList.add("escondido");
        let respostas = document.querySelectorAll(".resposta");
        tela6.innerHTML = ``;
        tela2.innerHTML= ``;
        exibirQuizz(respostaAPI)
        nivelUsuario;
        imgUsuario;
        textoUsuario;
        acertouResposta=0;
        questaoRespondida=0
        for (let i=0;i<respostas.length;i++){
            let divRespostas = respostas[i];
            divRespostas.parentNode.classList.remove("respondido")
            divRespostas.setAttribute("onclick", "comportamentoRespostas(this)");

            if(divRespostas.classList.contains("true")){
                divRespostas.classList.remove("colortrue");
            } else{
                divRespostas.classList.remove("colorfalse");
            }
        
            divRespostas.classList.remove("naoselecionado");
        }
    },2000);
}

function getDataApi(id){
    let promise = axios.get(`https://mock-api.driven.com.br/api/v6/buzzquizz/quizzes/${id}`);
    promise.then(exibirQuizz);
}

//Fim do quizz
let nivelUsuario;
let imgUsuario;
let textoUsuario;

function fimDoQuiz(){
 tela6.classList.remove("escondido");


levelUsuario.sort(function (x,y){
return x.minValue - y.minValue
})

const calcAcertos= Math.ceil((acertouResposta/qtdQuestoes.length)*100);
for(let i = 0; i<levelUsuario.length; i++){
    if(calcAcertos>= levelUsuario[i].minValue){
        nivelUsuario = levelUsuario[i].title
        imgUsuario= levelUsuario[i].image
        textoUsuario= levelUsuario[i].text
    }
   
}
tela6.innerHTML = `
        <div class="container_Fim">
            <div class="pontuacao_Box">
                <div class="top_Recado"><h3>${calcAcertos}% de acerto: ${nivelUsuario}</h3></div>
                <div class="bottom_image_texto">
                    <span class="imagem"><img src="${imgUsuario}" alt=""></span>
                    <div class="texto_Final"><h4">${textoUsuario}</h4></div>
                </div>
            </div>
            <div class="botoes">
                <button class="acessoQuiz" onclick="reiniciarQuizz()"><h5 class="branco">Reiniciar Quizz</h5></button>
                <button class="botao_Sem_Fundo" onclick="inicio()"><h5 class="cinza">Voltar para home</h5></button>
            </div>
        </div>
`
tela6.scrollIntoView({behavior:"smooth"})

}

//InnerHTML da Tela de Info
function abrirTelaInfo(){
    document.querySelector(".telaInfoQuiz").innerHTML =`
        <div class="conteiner_info">
            <h4>Começando pelo começo</h4>
            <div class="caixa_info">
                <input type="text" class="titulo"  placeholder="Título do Seu Quizz">
                <input type="url" class="url_Img"   placeholder="URL da imagem do seu Quizz">
                <input type="number" class="qnt_perguntas" placeholder="Quantidade de perguntas do seu Quizz">
                <input type="number" class="qnt_niveis"  placeholder="Quantidade de níveis do seu Quiz">
            </div>
            <button onclick="insertInfoQuizz()"><h4>Prosseguir pra criar perguntas</h4></button>
        </div>
    `;
    tela1.classList.add("escondido");
    tela3.classList.remove("escondido");
}

//Função de inserir as Infos do Quizz
let informacoesBasicas= {};
function insertInfoQuizz(){
    const titulo=document.querySelector("input.titulo").value;
    const imgQuizz=document.querySelector("input.url_Img").value;
    const qntPergunta=document.querySelector("input.qnt_perguntas").value;
    const qntNiveis=document.querySelector("input.qnt_niveis").value;

    if(!validacaoInfos(titulo,imgQuizz,qntPergunta, qntNiveis)){
        alert("Por favor, preencha corretamente.")
        return
    }

    informacoesBasicas.titulo=titulo;
    informacoesBasicas.imagem=imgQuizz;
    informacoesBasicas.perguntas=qntPergunta;
    informacoesBasicas.niveis=qntNiveis;

    criarPerguntas()
    limparInput();
    console.log(informacoesBasicas);
}

//Regex - Verificação de URL
let re = /([a-z\-_0-9\/\:\.]*\.(jpg|jpeg|png|gif))/i;
//Validação de Infos
function  validacaoInfos(title,url,numPergunta,NumNivel){

    if(title.length> 65 || title.length<20){
        alert("O título deve ter entre 20 e 65 letras!")
        return false
    }
    if(!re.test(url)){
        alert(`A imagem deve ser inserida como URL (Formato: https://www.exemplo.com)!`)
        return false
    }
    if(numPergunta<3){
       alert("Para um bom Quizz, você de fazer ao menos 3 perguntas!")
     return false
    }
    if(NumNivel<2){
        alert("Para o seu Quizz ser mais legal, deve ter ao menos 2 níveis!")
    return false
    } 
    return true
}

// Clear Input
function limparInput(){
    document.querySelector("input.titulo").value="";
    document.querySelector("input.url_Img").value="";
    document.querySelector("input.qnt_perguntas").value="";
    document.querySelector("input.qnt_niveis").value="";     
}

// Função de criar as perguntas
function criarPerguntas(){
    
    tela3.classList.add("escondido");
    tela4.classList.remove("escondido");

    let i=0;
    const qntPergunta=informacoesBasicas.perguntas;
    let pergunta =`<h3>Crie suas perguntas</h3>`;
    
    do{
        i+=1;
        pergunta += `
                <div class="pergunta">
                    <button type="button" class="buttonReadMore">
                        <h4>Pergunta ${[i]}</h4>
                        <ion-icon class="iconeReadMore" name="create-outline" >
                        </ion-icon>
                    </button>
                    <div class="container">
                        <input id="inputPergunta" class="textoPergunta" type="text" placeholder="Texto da pergunta">
                        <input id="inputPergunta" class="corPergunta" type="text" placeholder="Cor de fundo da pergunta">
                        
                        <h4>Resposta correta</h4>
                        <input id="inputPergunta" class="respostaCorreta" type="text" placeholder="Resposta correta">
                        <input id="inputPergunta" type="url" class="urlRespostaCorreta" placeholder="URL da imagem">
                        
                        <h4>Respostas incorretas</h4>
                        <input id="inputPergunta" type="text" class="respostaIncorreta" placeholder="Resposta incorreta 1">
                        <input id="inputURLPergunta" type="url" class="urlRespostaIncorreta"  placeholder="URL da imagem 1">
                        <input id="inputPergunta" type="text" class="respostaIncorreta" placeholder="Resposta incorreta 2">
                        <input id="inputURLPergunta" type="url" class="urlRespostaIncorreta" placeholder="URL da imagem 2">
                        <input id="inputPergunta" type="text" class="respostaIncorreta" placeholder="Resposta incorreta 3">
                        <input id="inputURLPergunta" type="url" class="urlRespostaIncorreta" placeholder="URL da imagem 3">
                    </div>
                </div>
        `
    } while (i<qntPergunta);

    document.querySelector(".telaCriarPerguntas").innerHTML += pergunta;
    document.querySelector(".telaCriarPerguntas").innerHTML += `<button class="botaoGeral" onclick="objPerguntas()">Prosseguir para criar níveis</button>`
    colapsarSecao();
}

// Para fazer surgir a seção na criação das perguntas
function colapsarSecao(){
    let collapse = document.getElementsByClassName("buttonReadMore");

    for (let i = 0; i < collapse.length; i++) {
        collapse[i].addEventListener("click", function() {
            this.classList.toggle("active");
            let content = this.nextElementSibling; 
            // console.log(content);
                if (content.style.display === "initial") {
                    content.style.display = "none";
                } else {
                    content.style.display = "initial";
                }
        });
    }
}

let informacoesPerguntas = [];
let arrayInputRespostasIncorretas = Array();
let arrayInputUrlIncorretas = Array();

function verificarPerguntas(){
    const perguntas = document.querySelectorAll(".pergunta");
    
    for(let j=0; j<perguntas.length; j++){

        const textoPergunta = perguntas[j].querySelector("input.textoPergunta").value;
        const corPergunta = perguntas[j].querySelector("input.corPergunta").value;
        const respostaCorreta = perguntas[j].querySelector("input.respostaCorreta").value;
        const urlRespostaCorreta = perguntas[j].querySelector("input.urlRespostaCorreta").value;
        const respostasIncorretas = perguntas[j].querySelectorAll("input.respostaIncorreta");
        const urlRespostasIncorretas = perguntas[j].querySelectorAll("input.urlRespostaIncorreta");
        
        const respostasIncorretasLength = respostasIncorretas.length;  
        
        let re2 = /[0-9A-Fa-f]{6}/g; //Verificar hexadecimal

            // Para verificar se há ao menos uma resposta incorreta
            for (let i=0; i<respostasIncorretasLength;i++){
                let inputRespostasIncorretas = respostasIncorretas[i].value; 
                let inputUrlIncorretas = urlRespostasIncorretas[i].value; 

                if (inputRespostasIncorretas.length !== 0 && inputUrlIncorretas.length !== 0 ){
                    arrayInputRespostasIncorretas[i]=inputRespostasIncorretas;
                    arrayInputUrlIncorretas[i]=inputUrlIncorretas;

                    if (!re.test(arrayInputUrlIncorretas)){
                        alert(`A imagem deve ser inserida como URL (Formato: https://www.exemplo.jpeg)!`)
                        return false;
                    }
                    return arrayInputUrlIncorretas, arrayInputRespostasIncorretas;
                }
            }
                // Filtrando array
            let filtered = arrayInputRespostasIncorretas.filter(function(el){ 
                return el != null;
                });
            let filtered2 = arrayInputUrlIncorretas.filter(function(el){ 
                return el != null;
                });

            if(arrayInputRespostasIncorretas.length === 0 && arrayInputUrlIncorretas.length === 0){
                alert("Insira ao menos uma resposta incorreta!");
            }

            if(textoPergunta.length<20){
                alert("O título deve ter mais de 20 letras!");
            }

            if (!re2.test(corPergunta)){
                alert("Insira uma cor em hexadecimal!");
            }

            if(respostaCorreta.length === 0 && urlRespostaCorreta.length === 0){
                alert("Insira a resposta correta!");
            }

            if(!re.test(urlRespostaCorreta)){
                    alert(`A imagem deve ser inserida como URL (Formato: https://www.exemplo.com)!`);
                    return false;
            }
            return true;
    }
}

// Criar objeto das perguntas - Tem que arrumar, ta repetindo mta variavel criada antes(deixei assim pq tava dando erro)
function objPerguntas(){
    const perguntas = document.querySelectorAll(".pergunta");

    if (verificarPerguntas()){
        for(let j=0; j<perguntas.length; j++){
            const textoPergunta = perguntas[j].querySelector("input.textoPergunta").value;
            const corPergunta = perguntas[j].querySelector("input.corPergunta").value;
            const respostaCorreta = perguntas[j].querySelector("input.respostaCorreta").value;
            const urlRespostaCorreta = perguntas[j].querySelector("input.urlRespostaCorreta").value;
            const respostasIncorretas = perguntas[j].querySelectorAll("input.respostaIncorreta");
            const urlRespostasIncorretas = perguntas[j].querySelectorAll("input.urlRespostaIncorreta");
            

            const respostasIncorretasLength = respostasIncorretas.length;
            const urlRespostasIncorretasLength = urlRespostasIncorretas.length;

            for (let i=0; i<respostasIncorretasLength;i++){
                let inputRespostasIncorretas = respostasIncorretas[i].value;
                let inputUrlIncorretas = urlRespostasIncorretas[i].value;    

                if (inputRespostasIncorretas.length !== 0 && inputUrlIncorretas.length !== 0){
                    arrayInputRespostasIncorretas[i]=inputRespostasIncorretas;
                    arrayInputUrlIncorretas[i]=inputUrlIncorretas;
                }
            }
    
            informacoesPerguntas.push({
                texto: textoPergunta,
                cor:corPergunta,
                respCorreta:respostaCorreta,
                imgRespCorreta:urlRespostaCorreta,
                respIncorreta:arrayInputRespostasIncorretas,
                imgRespIncorreta:arrayInputUrlIncorretas
            })
        }
        abrirTelaNiveis();
    }
  
}

//Para criar os níveis
let nodeNivel;
let contadorPorcentagem=0;
let arrNivel=[];
function abrirTelaNiveis(){
    console.log(informacoesPerguntas);
    tela4.classList.add("escondido");
    tela5.classList.remove("escondido");
    let numeroNiveis= Number(informacoesBasicas.niveis);
    tela4.innerHTML=``
    tela5.innerHTML =`<h3>Agora, decida os níveis</h3>`
    for(let i = 1 ; i<=numeroNiveis;i++){
        // console.log("rodeos")
        tela5.innerHTML += `
                <div class="nivel">
                    <button type="button" class="buttonReadMore">
                        <h4>Nivel ${i}</h4>
                        <ion-icon class="iconeReadMore" name="create-outline" >
                        </ion-icon>
                    </button>
                <div class="container">
                    <input id="inputPergunta" class="tituloNivel" type="text" placeholder="Título do nível">
                    <input id="inputPergunta" class="porcentagem" type="number" placeholder="% de acerto mínima"> 
                    <input id="inputPergunta" class="imgNivel" type="url" placeholder="URL da imagem do nível">
                    <input id="inputNivelDesc" class="descNivel" type="text" placeholder="Descrição do nível"> 
                </div>
                </div>     
                `
}
    tela5.innerHTML += `<button class="botaoGeral" onclick="finalizarNivel()">Finalizar Quizz</button>`
    nodeNivel=document.querySelectorAll(".nivel")
    colapsarSecao()
}

function insertNivel(){
    for(let i = 0; i<nodeNivel.length; i++){
            let nivel = nodeNivel[i];
            
        if(verificarNiveis(nivel,i)){
            const tituloNivel = nivel.querySelector(".tituloNivel").value;
            const porcentagemAcerto= nivel.querySelector(".porcentagem").value;
            const imgNivel= nivel.querySelector(".imgNivel").value;
            const descNivel= nivel.querySelector(".descNivel").value;

            arrNivel.push({
                title:tituloNivel,
                min_Acerto:porcentagemAcerto,
                imagem:imgNivel,
                descricao:descNivel
            })

             if(contadorPorcentagem===(nodeNivel.length)){
                 alert("Para o quiz ficar divertido, tem que haver ao menos um nível com a porcentagem mínima de acerto igual a 0!");
                  alert("Por favor, preencha corretamente!");
                  arrNivel=[];
                 break;
             }
            }
            else{
                 arrNivel=[];
                 alert("Por favor, preencha corretamente!");
                 break;
             }
           
             
        
    }
    enviarQuizzApi();
    console.log(arrNivel);
}

function verificarNiveis(nivel,numNivel){
    const tituloNivel = nivel.querySelector(".tituloNivel").value;
    const porcentagemAcerto= nivel.querySelector(".porcentagem").value;
    const linkImg= nivel.querySelector(".imgNivel").value;
    const descNivel= nivel.querySelector(".descNivel").value;
    const porcentagemValida = (parseInt(porcentagemAcerto)<=100 && parseInt(porcentagemAcerto)>=0);
    
    console.log(porcentagemAcerto)
     if(tituloNivel.length<10||!tituloNivel){
        alert(`Um título legal tem que ter mais de 10 letras! Confira Nível ${numNivel+1}`);
        return false
    }
    if (!porcentagemValida||!porcentagemAcerto){
        alert(`A porcentagem de acerto tem que ser entre 100 e 0! Confira Nível ${numNivel+1}`);
        return false
    }

    if(!re.test(linkImg)){
        alert(`A imagem tem que ser um link! Confira Nível ${numNivel+1}`);
        return false
    }
    
    if(descNivel.length<30){
        alert(`Um nível legal tem que ter uma descrição com mais de 30 letras! Confira Nível ${numNivel+1}`);
        return false
    }
    if(parseInt(porcentagemAcerto)!==0){
        contadorPorcentagem+=1;
    }
   return true

}

function finalizarNivel(){
    insertNivel()
}

//Envio do Quiz Para API
function enviarQuizzApi(){
    let objQuizz = {
            title: informacoesBasicas.titulo,
            image: informacoesBasicas.imagem,
            questions: [],
            levels: []
        }
        
        for (let i = 0; i < informacoesPerguntas.length; i++) {
            objQuizz.questions.push({
                title: informacoesPerguntas[i].texto,
                color: informacoesPerguntas[i].cor,
                answers: [{
                    text: informacoesPerguntas[i].respCorreta,
                    image: informacoesPerguntas[i].imgRespCorreta,
                    isCorrectAnswer: true
                }]
            })

            for (let j = 0; j < informacoesPerguntas[i].respIncorreta.length; j++) {
                objQuizz.questions[i].answers.push({
                    text: informacoesPerguntas[i].respIncorreta[j],
                    image: informacoesPerguntas[i].imgRespIncorreta[j],
                    isCorrectAnswer: false
                })
            }
        }

        for (let i=0; i<arrNivel.length; i++){
            objQuizz.levels.push({
                title: arrNivel[i].title,
                image: arrNivel[i].imagem,
                text: arrNivel[i].descricao,
                minValue: Number(arrNivel[i].min_Acerto)
            })
        }

    console.log(objQuizz);
    console.log(JSON.stringify(objQuizz))
    const promise = axios.post("https://mock-api.driven.com.br/api/v6/buzzquizz/quizzes", objQuizz);
    promise.then(quizUsuarioLocalStorage)
    promise.catch(function(){

        alert('Erro')});
}

function quizUsuarioLocalStorage(resposta){
    let quizzId = [];
    
    quizzId = resposta.data.id;
    console.log(quizzId);

    if(listaIdsUsuario===null){ 
        listaIdsUsuario=[]
    }

    localStorage.setItem("IdUsuario", JSON.stringify(quizzId));
    getQuizUsuarioLocalStorage();
}


// Pegar os Ids do usuário
function getQuizUsuarioLocalStorage(){
    listaIdsUsuario.push(localStorage.getItem("IdUsuario"));
    console.log(listaIdsUsuario);

    let stringIds = JSON.stringify(listaIdsUsuario);
    localStorage.setItem("listaIdsUsuarioLocalStorage", stringIds);
    // listaIdsUsuario =  JSON.parse(localStorage.getItem("listaIdsUsuarioLocalStorage"));
    console.log(listaIdsUsuario);
    pedirQuizzData()
}

function pedirQuizzData(){ 
    const ultimoID= listaIdsUsuario[listaIdsUsuario.length-1];
    const promise = axios.get(`https://mock-api.driven.com.br/api/v6/buzzquizz/quizzes/${ultimoID}`)
    promise.then(telaSucessoQuizz)
}

function telaSucessoQuizz(response){
    const dataQuizz=response.data;
    tela5.classList.add("escondido");
    tela7.classList.remove("escondido");
    tela7.innerHTML+=`
                <div class="titulo"> 
                    <h3>Seu quizz está pronto!</h3> 
                </div>
                <div class="preview_Quizz">
                    <img src=${dataQuizz.image} alt="Imagem principal do seu Quizz">
                    <div class="blackCover"></div>
                    <div class="nome_Quizz"><h2> ${dataQuizz.title} </h2></div>
                </div>
                <div class="botoes">
                    <button class="acessoQuiz" onclick="acessarQuizz(${dataQuizz.id})"><h5 class="branco">Acessar quizz</h5></button>
                    <button class="botao_Sem_Fundo" onclick="inicio()"><h5 class="cinza">Voltar para home</h5></button>
                </div>
    `
    alert("Deu boa");
}


function acessarQuizz(id){
    tela7.classList.add("escondido")
    getDataApi(id)
}