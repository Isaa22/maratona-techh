document.addEventListener('DOMContentLoaded', function() {
    // Elementos do DOM
    const searchBtn = document.getElementById('searchBtn');
    const searchInput = document.getElementById('searchInput');
    const lessonModal = document.getElementById('lessonModal');
    const closeBtn = document.querySelector('.close-btn');
    const lessonTopic = document.getElementById('lessonTopic');
    const slidesContainer = document.getElementById('slidesContainer');
    const downloadPdfBtn = document.getElementById('downloadPdf');
    const shareLessonBtn = document.getElementById('shareLesson');
    
    // Gerar aula quando o botão é clicado
    searchBtn.addEventListener('click', generateLesson);
    
    // Também gerar aula quando Enter é pressionado
    searchInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            generateLesson();
        }
    });
    
    // Fechar modal
    closeBtn.addEventListener('click', function() {
        lessonModal.style.display = 'none';
    });
    
    // Fechar modal ao clicar fora
    window.addEventListener('click', function(e) {
        if (e.target === lessonModal) {
            lessonModal.style.display = 'none';
        }
    });
    
    // Baixar PDF (simulação)
    downloadPdfBtn.addEventListener('click', function() {
        alert('PDF da aula será baixado em breve!');
    });
    
    // Compartilhar aula (simulação)
    shareLessonBtn.addEventListener('click', function() {
        if (navigator.share) {
            navigator.share({
                title: `Aula sobre ${lessonTopic.textContent}`,
                text: `Confira esta aula gerada sobre ${lessonTopic.textContent} no AulaEmergencial`,
                url: window.location.href
            }).catch(err => {
                console.log('Erro ao compartilhar:', err);
            });
        } else {
            alert('Link da aula copiado para a área de transferência!');
        }
    });
    
    // Função para gerar a aula
    function generateLesson() {
        const topic = searchInput.value.trim();
        
        if (!topic) {
            alert('Por favor, digite um tema para a aula');
            return;
        }
        
        // Mostrar loading
        lessonTopic.textContent = topic;
        slidesContainer.innerHTML = '<div class="loading">Gerando aula... <i class="fas fa-spinner fa-spin"></i></div>';
        lessonModal.style.display = 'block';
        
        // Simular tempo de processamento
        setTimeout(() => {
            createLessonSlides(topic);
        }, 1500);
    }
    
    // Função para criar os slides da aula
    function createLessonSlides(topic) {
        slidesContainer.innerHTML = '';
        
        // Gerar 10 slides com conteúdo simulado
        for (let i = 0; i < 10; i++) {
            const slide = document.createElement('div');
            slide.className = 'slide';
            
            let slideContent = '';
            let slideTitle = '';
            
            switch (i) {
                case 0:
                    slideTitle = `Introdução: ${topic}`;
                    slideContent = `
                        <p>Nesta aula, vamos explorar o tema <strong>${topic}</strong>, compreendendo seus conceitos fundamentais e aplicações.</p>
                        <p>Este conteúdo é essencial para seu aprendizado e será abordado de forma clara e objetiva.</p>
                    `;
                    break;
                    
                case 1:
                    slideTitle = `O que é ${topic}?`;
                    slideContent = `
                        <p><strong>${topic}</strong> pode ser definido como...</p>
                        <p>Segundo especialistas, trata-se de um conceito que...</p>
                        <ul>
                            <li>Característica principal 1</li>
                            <li>Característica principal 2</li>
                            <li>Característica principal 3</li>
                        </ul>
                    `;
                    break;
                    
                case 2:
                    slideTitle = `História e Origem`;
                    slideContent = `
                        <p>O estudo de <strong>${topic}</strong> teve início em...</p>
                        <p>Os principais contribuidores para este campo foram:</p>
                        <ul>
                            <li>Pesquisador 1 (Ano) - Contribuição</li>
                            <li>Pesquisador 2 (Ano) - Contribuição</li>
                        </ul>
                    `;
                    break;
                    
                case 3:
                    slideTitle = `Principais Conceitos`;
                    slideContent = `
                        <p>Para entender <strong>${topic}</strong>, é fundamental compreender:</p>
                        <ul>
                            <li>Conceito 1: Explicação breve</li>
                            <li>Conceito 2: Explicação breve</li>
                            <li>Conceito 3: Explicação breve</li>
                        </ul>
                        <p>Estes conceitos se relacionam da seguinte forma...</p>
                    `;
                    break;
                    
                case 4:
                    slideTitle = `Exemplos Práticos`;
                    slideContent = `
                        <p>Aplicações de <strong>${topic}</strong> no mundo real:</p>
                        <ul>
                            <li>Exemplo 1: Descrição</li>
                            <li>Exemplo 2: Descrição</li>
                        </ul>
                        <p>Estes exemplos demonstram como o conceito se manifesta no cotidiano.</p>
                    `;
                    break;
                    
                case 5:
                    slideTitle = `Fórmulas e Cálculos`;
                    slideContent = `
                        <p>Para trabalhar com <strong>${topic}</strong>, utilizamos as seguintes fórmulas:</p>
                        <ul>
                            <li>Fórmula 1: Explicação</li>
                            <li>Fórmula 2: Explicação</li>
                        </ul>
                        <p>Exemplo de cálculo:</p>
                        <p>Dados: X = 10, Y = 5</p>
                        <p>Resultado: 10 + 5 = 15</p>
                    `;
                    break;
                    
                case 6:
                    slideTitle = `Casos de Estudo`;
                    slideContent = `
                        <p>Estudo de caso sobre <strong>${topic}</strong>:</p>
                        <p>Situação: Descrição do cenário</p>
                        <p>Análise: Como o conceito se aplica</p>
                        <p>Resultados: O que foi observado</p>
                    `;
                    break;
                    
                case 7:
                    slideTitle = `Comparações`;
                    slideContent = `
                        <p><strong>${topic}</strong> comparado com outros conceitos similares:</p>
                        <ul>
                            <li>Semelhanças: Pontos em comum</li>
                            <li>Diferenças: Aspectos distintos</li>
                        </ul>
                        <p>Esta comparação ajuda a entender melhor as particularidades.</p>
                    `;
                    break;
                    
                case 8:
                    slideTitle = `Exercícios Práticos`;
                    slideContent = `
                        <p>Teste seu conhecimento sobre <strong>${topic}</strong>:</p>
                        <ol>
                            <li>Pergunta 1?</li>
                            <li>Pergunta 2?</li>
                            <li>Pergunta 3?</li>
                        </ol>
                        <p>Respostas no próximo slide...</p>
                    `;
                    break;
                    
                case 9:
                    slideTitle = `Conclusão e Referências`;
                    slideContent = `
                        <p>Nesta aula, vimos que <strong>${topic}</strong> é importante porque...</p>
                        <p>Principais pontos aprendidos:</p>
                        <ul>
                            <li>Ponto 1</li>
                            <li>Ponto 2</li>
                            <li>Ponto 3</li>
                        </ul>
                        <p>Referências bibliográficas:</p>
                        <ul>
                            <li>Autor 1 (Ano). Título do livro.</li>
                            <li>Autor 2 (Ano). Título do artigo.</li>
                        </ul>
                    `;
                    break;
            }
            
            slide.innerHTML = `
                <h4>${slideTitle}</h4>
                ${slideContent}
                <div class="slide-number">${i + 1}/10</div>
            `;
            
            slidesContainer.appendChild(slide);
        }
        
        // Adicionar estilo para os números dos slides
        const style = document.createElement('style');
        style.textContent = `
            .slide {
                position: relative;
                padding-bottom: 40px;
            }
            .slide-number {
                position: absolute;
                bottom: 10px;
                right: 20px;
                color: rgba(255, 255, 255, 0.5);
                font-size: 0.9rem;
            }
            .loading {
                text-align: center;
                padding: 50px;
                font-size: 1.2rem;
            }
            .fa-spinner {
                margin-left: 10px;
            }
        `;
        document.head.appendChild(style);
    }
    
    // Simular clique nos tópicos rápidos
    document.querySelectorAll('.quick-links a').forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            searchInput.value = this.textContent;
            generateLesson();
        });
    });
});
