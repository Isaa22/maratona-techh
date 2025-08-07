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
    const saveLessonBtn = document.getElementById('saveLesson');
    const difficultyLevel = document.getElementById('difficultyLevel');
    
    // Configuração da API (em produção, isso deve ser gerenciado no backend)
    const OPENAI_API_KEY = 'sua_chave_api_aqui'; // Substitua por sua chave real
    const OPENAI_API_URL = 'https://api.openai.com/v1/chat/completions';
    const USE_API = false; // Altere para true para usar a API real
    
    // Inicializar aulas salvas
    loadSavedLessons();
    
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
    
    // Baixar PDF
    downloadPdfBtn.addEventListener('click', downloadPdf);
    
    // Compartilhar aula
    shareLessonBtn.addEventListener('click', shareLesson);
    
    // Salvar aula
    saveLessonBtn.addEventListener('click', saveLesson);
    
    // Simular clique nos tópicos rápidos
    document.querySelectorAll('.quick-links a').forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            searchInput.value = this.textContent;
            generateLesson();
        });
    });
    
    // Função principal para gerar a aula
    async function generateLesson() {
        const topic = searchInput.value.trim();
        const difficulty = difficultyLevel.value;
        
        if (!topic) {
            showAlert('Por favor, digite um tema para a aula');
            return;
        }
        
        // Mostrar loading
        lessonTopic.textContent = topic;
        slidesContainer.innerHTML = '<div class="loading">Gerando aula... <i class="fas fa-spinner fa-spin"></i></div>';
        lessonModal.style.display = 'block';
        
        try {
            let slides;
            
            if (USE_API && OPENAI_API_KEY) {
                slides = await generateAIContent(topic, difficulty);
            } else {
                // Usar conteúdo simulado se a API não estiver ativada
                slides = generateMockContent(topic, difficulty);
            }
            
            createLessonSlides(topic, slides);
        } catch (error) {
            console.error('Erro ao gerar aula:', error);
            slidesContainer.innerHTML = `
                <div class="error">
                    <i class="fas fa-exclamation-triangle"></i>
                    <p>Erro ao gerar a aula. Por favor, tente novamente mais tarde.</p>
                    ${USE_API ? `<small>${error.message}</small>` : ''}
                </div>
            `;
        }
    }
    
    // Gerar conteúdo usando API de IA
    async function generateAIContent(topic, difficulty) {
        const prompt = `Crie uma aula completa sobre ${topic} com 10 slides formatados em JSON.
        Nível de dificuldade: ${difficulty}.
        Inclua títulos e conteúdo em HTML formatado para cada slide.
        Adicione exemplos, gráficos e diagramas quando apropriado.
        Formato de resposta esperado: {
            "slides": [
                {
                    "title": "Título do slide",
                    "content": "Conteúdo em HTML com formatação"
                }
            ]
        }`;
        
        const response = await fetch(OPENAI_API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${OPENAI_API_KEY}`
            },
            body: JSON.stringify({
                model: "gpt-3.5-turbo",
                messages: [{ role: "user", content: prompt }],
                temperature: 0.7
            })
        });
        
        if (!response.ok) {
            throw new Error(`Erro na API: ${response.status}`);
        }
        
        const data = await response.json();
        const content = data.choices[0].message.content;
        return JSON.parse(content).slides;
    }
    
    // Gerar conteúdo simulado para demonstração
    function generateMockContent(topic, difficulty) {
        const difficultyModifiers = {
            'básico': { depth: 'simples', examples: 2, technicality: 0.3 },
            'intermediário': { depth: 'moderado', examples: 3, technicality: 0.6 },
            'avançado': { depth: 'aprofundado', examples: 4, technicality: 0.9 }
        };
        
        const mod = difficultyModifiers[difficulty] || difficultyModifiers['intermediário'];
        
        return Array.from({ length: 10 }, (_, i) => generateMockSlide(topic, i, mod));
    }
    
    function generateMockSlide(topic, index, mod) {
        const titles = [
            `Introdução: ${topic}`,
            `O que é ${topic}?`,
            `História e Origem`,
            `Principais Conceitos`,
            `Exemplos Práticos`,
            `Fórmulas e Cálculos`,
            `Casos de Estudo`,
            `Comparações`,
            `Exercícios Práticos`,
            `Conclusão e Referências`
        ];
        
        const contents = [
            `
                <p>Nesta aula ${mod.depth}, vamos explorar o tema <strong>${topic}</strong>.</p>
                <p>Este conteúdo é essencial e será abordado de forma ${mod.depth}.</p>
                ${generateVisualization('intro', topic)}
            `,
            `
                <p><strong>${topic}</strong> pode ser definido como...</p>
                <p>Segundo especialistas, trata-se de um conceito que...</p>
                <ul>
                    <li>Característica principal 1</li>
                    <li>Característica principal 2</li>
                    ${mod.technicality > 0.5 ? '<li>Característica técnica avançada</li>' : ''}
                </ul>
            `,
            `
                <p>O estudo de <strong>${topic}</strong> teve início em...</p>
                <p>Principais contribuidores:</p>
                <ul>
                    <li>Pesquisador 1 (${1900 + Math.floor(Math.random() * 100)}) - Contribuição importante</li>
                    <li>Pesquisador 2 (${1900 + Math.floor(Math.random() * 100)}) - Contribuição complementar</li>
                </ul>
            `,
            `
                <p>Para entender <strong>${topic}</strong>, é fundamental:</p>
                <ul>
                    <li>Conceito 1: Explicação ${mod.depth}</li>
                    <li>Conceito 2: Explicação ${mod.depth}</li>
                    ${mod.technicality > 0.7 ? '<li>Conceito técnico avançado</li>' : ''}
                </ul>
                ${generateVisualization('concepts', topic)}
            `,
            `
                <p>Aplicações de <strong>${topic}</strong> no mundo real:</p>
                <ul>
                    ${Array.from({ length: mod.examples }, (_, i) => 
                        `<li>Exemplo ${i+1}: Situação ${mod.depth} de aplicação</li>`
                    ).join('')}
                </ul>
                ${generateVisualization('examples', topic)}
            `,
            `
                <p>Fórmulas relacionadas a <strong>${topic}</strong>:</p>
                <ul>
                    <li>Fórmula básica: <code>x = y + z</code></li>
                    ${mod.technicality > 0.5 ? 
                        `<li>Fórmula avançada: <code>f(x) = ${Math.floor(Math.random() * 10)}x² + ${Math.floor(Math.random() * 10)}x + ${Math.floor(Math.random() * 10)}</code></li>` : ''}
                </ul>
                <p>Exemplo de cálculo:</p>
                <p>Dados: X = ${Math.floor(Math.random() * 10)}, Y = ${Math.floor(Math.random() * 10)}</p>
                <p>Resultado: ${Math.floor(Math.random() * 100)}</p>
            `,
            `
                <p>Estudo de caso sobre <strong>${topic}</strong>:</p>
                <p>Situação: Cenário ${mod.depth}</p>
                <p>Análise: Como o conceito se aplica</p>
                <p>Resultados: ${Math.floor(Math.random() * 100)}% de eficácia</p>
                ${generateVisualization('case', topic)}
            `,
            `
                <p><strong>${topic}</strong> comparado com conceitos similares:</p>
                <ul>
                    <li>Semelhanças: ${Math.floor(Math.random() * 3) + 2} pontos em comum</li>
                    <li>Diferenças: ${Math.floor(Math.random() * 3) + 2} aspectos distintos</li>
                </ul>
            `,
            `
                <p>Teste seu conhecimento sobre <strong>${topic}</strong>:</p>
                <ol>
                    ${Array.from({ length: 3 }, (_, i) => 
                        `<li>Pergunta ${i+1} sobre ${mod.depth === 'avançado' ? 'aspecto avançado' : 'conceito básico'}?</li>`
                    ).join('')}
                </ol>
            `,
            `
                <p>Nesta aula, vimos que <strong>${topic}</strong> é importante porque...</p>
                <p>Principais pontos aprendidos:</p>
                <ul>
                    <li>Ponto 1: Resumo ${mod.depth}</li>
                    <li>Ponto 2: Resumo ${mod.depth}</li>
                    <li>Ponto 3: Resumo ${mod.depth}</li>
                </ul>
                <p>Referências bibliográficas:</p>
                <ul>
                    <li>Autor Principal (${2020 - Math.floor(Math.random() * 10)}). Título do ${mod.depth} livro.</li>
                    <li>Autor Secundário (${2020 - Math.floor(Math.random() * 10)}). Artigo complementar.</li>
                </ul>
            `
        ];
        
        return {
            title: titles[index],
            content: contents[index]
        };
    }
    
    // Criar slides na interface
    function createLessonSlides(topic, slides) {
        slidesContainer.innerHTML = '';
        
        slides.forEach((slide, index) => {
            const slideElement = document.createElement('div');
            slideElement.className = 'slide';
            
            slideElement.innerHTML = `
                <h4>${slide.title}</h4>
                ${slide.content}
                <div class="slide-number">${index + 1}/${slides.length}</div>
            `;
            
            slidesContainer.appendChild(slideElement);
        });
    }
    
    // Gerar visualizações (gráficos/diagramas)
    function generateVisualization(type, topic) {
        const colors = ['#6c5ce7', '#00cec9', '#fd79a8', '#fdcb6e', '#00b894'];
        const randomColors = [...colors].sort(() => Math.random() - 0.5);
        
        if (type === 'concepts' || Math.random() > 0.5) {
            // Gráfico de barras
            const values = Array.from({ length: 5 }, () => Math.floor(Math.random() * 80) + 20);
            
            return `
                <div class="visualization">
                    <h5>Dados Comparativos</h5>
                    <div class="bar-chart">
                        ${values.map((value, i) => `
                            <div class="bar-container">
                                <div class="bar" style="height: ${value}%; background-color: ${randomColors[i]};">
                                    <span>${value}%</span>
                                </div>
                                <label>${['Aspecto', 'Fator', 'Elemento', 'Componente', 'Variável'][i]}</label>
                            </div>
                        `).join('')}
                    </div>
                </div>
            `;
        } else {
            // Diagrama de processo
            const steps = ['Início', 'Passo 1', 'Passo 2', 'Passo 3', 'Resultado'];
            
            return `
                <div class="visualization">
                    <h5>Diagrama de Processo</h5>
                    <div class="process-diagram">
                        ${steps.map((step, i) => `
                            <div class="process-step" style="border-color: ${randomColors[i]};">
                                <div class="step-content">${step}</div>
                                ${i < steps.length - 1 ? 
                                    `<div class="step-arrow" style="background-color: ${randomColors[i]};"></div>` : ''}
                            </div>
                        `).join('')}
                    </div>
                </div>
            `;
        }
    }
    
    // Baixar PDF da aula
    function downloadPdf() {
        const { jsPDF } = window.jspdf;
        const doc = new jsPDF();
        
        doc.text(`Aula sobre: ${lessonTopic.textContent}`, 10, 10);
        
        const slides = document.querySelectorAll('.slide');
        slides.forEach((slide, index) => {
            if (index > 0) doc.addPage();
            doc.text(slide.querySelector('h4').textContent, 10, 20);
            
            // Simples extração de texto (em implementação real, use biblioteca mais sofisticada)
            const textContent = slide.textContent.replace(/\s+/g, ' ');
            doc.text(textContent, 10, 30, { maxWidth: 180 });
        });
        
        doc.save(`Aula-${lessonTopic.textContent}.pdf`);
    }
    
    // Compartilhar aula
    async function shareLesson() {
        const shareData = {
            title: `Aula sobre ${lessonTopic.textContent}`,
            text: `Confira esta aula gerada sobre ${lessonTopic.textContent} no AulaEmergencial`,
            url: window.location.href
        };
        
        try {
            if (navigator.share) {
                await navigator.share(shareData);
            } else {
                // Fallback para copiar link
                await navigator.clipboard.writeText(shareData.url);
                showAlert('Link copiado para a área de transferência!');
            }
        } catch (err) {
            console.log('Erro ao compartilhar:', err);
            showAlert('Não foi possível compartilhar. Tente copiar o link manualmente.');
        }
    }
    
    // Salvar aula localmente
    function saveLesson() {
        const topic = lessonTopic.textContent;
        const difficulty = difficultyLevel.value;
        const slides = Array.from(document.querySelectorAll('.slide')).map(slide => ({
            title: slide.querySelector('h4').textContent,
            content: slide.innerHTML
        }));
        
        const lessons = JSON.parse(localStorage.getItem('savedLessons') || '[]');
        const newLesson = {
            id: Date.now(),
            topic,
            slides,
            difficulty,
            date: new Date().toLocaleDateString('pt-BR')
        };
        
        lessons.push(newLesson);
        localStorage.setItem('savedLessons', JSON.stringify(lessons));
        
        showAlert('Aula salva com sucesso!');
        loadSavedLessons();
    }
    
    // Carregar aulas salvas
    function loadSavedLessons() {
        const savedLessonsContainer = document.getElementById('savedLessonsContainer');
        const lessons = JSON.parse(localStorage.getItem('savedLessons') || '[]');
        
        if (lessons.length === 0) {
            savedLessonsContainer.innerHTML = '<p class="no-lessons">Nenhuma aula salva ainda.</p>';
            return;
        }
        
        savedLessonsContainer.innerHTML = lessons.map(lesson => `
            <div class="lesson-card" data-id="${lesson.id}">
                <h4>${lesson.topic}</h4>
                <div class="lesson-meta">
                    <span class="difficulty ${lesson.difficulty}">${lesson.difficulty}</span>
                    <span class="date">${lesson.date}</span>
                </div>
                <button class="view-lesson" data-id="${lesson.id}">
                    <i class="fas fa-eye"></i> Visualizar
                </button>
                <button class="delete-lesson" data-id="${lesson.id}">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        `).join('');
        
        // Adicionar eventos aos botões
        document.querySelectorAll('.view-lesson').forEach(btn => {
            btn.addEventListener('click', function() {
                const lessonId = parseInt(this.getAttribute('data-id'));
                viewSavedLesson(lessonId);
            });
        });
        
        document.querySelectorAll('.delete-lesson').forEach(btn => {
            btn.addEventListener('click', function() {
                const lessonId = parseInt(this.getAttribute('data-id'));
                deleteSavedLesson(lessonId);
            });
        });
    }
    
    // Visualizar aula salva
    function viewSavedLesson(lessonId) {
        const lessons = JSON.parse(localStorage.getItem('savedLessons') || '[]');
        const lesson = lessons.find(l => l.id === lessonId);
        
        if (!lesson) return;
        
        lessonTopic.textContent = lesson.topic;
        slidesContainer.innerHTML = '';
        
        lesson.slides.forEach(slide => {
            const slideElement = document.createElement('div');
            slideElement.className = 'slide';
            slideElement.innerHTML = slide.content;
            slidesContainer.appendChild(slideElement);
        });
        
        // Atualizar seletor de dificuldade
        difficultyLevel.value = lesson.difficulty;
        
        lessonModal.style.display = 'block';
    }
    
    // Excluir aula salva
    function deleteSavedLesson(lessonId) {
        if (!confirm('Tem certeza que deseja excluir esta aula salva?')) return;
        
        const lessons = JSON.parse(localStorage.getItem('savedLessons') || '[]');
        const updatedLessons = lessons.filter(l => l.id !== lessonId);
        
        localStorage.setItem('savedLessons', JSON.stringify(updatedLessons));
        loadSavedLessons();
    }
    
    // Mostrar alerta estilizado
    function showAlert(message) {
        const alertBox = document.createElement('div');
        alertBox.className = 'alert-box';
        alertBox.innerHTML = `
            <p>${message}</p>
            <button class="close-alert"><i class="fas fa-times"></i></button>
        `;
        
        document.body.appendChild(alertBox);
        
        // Fechar alerta após 3 segundos ou quando clicar
        setTimeout(() => {
            alertBox.classList.add('fade-out');
            setTimeout(() => alertBox.remove(), 300);
        }, 3000);
        
        alertBox.querySelector('.close-alert').addEventListener('click', () => {
            alertBox.remove();
        });
    }
    
    // Adicionar estilos dinâmicos
    const dynamicStyles = document.createElement('style');
    dynamicStyles.textContent = `
        .loading, .error {
            text-align: center;
            padding: 50px;
            font-size: 1.2rem;
        }
        
        .error {
            color: #ff7675;
        }
        
        .error i {
            font-size: 2rem;
            margin-bottom: 15px;
        }
        
        .slide {
            position: relative;
            padding-bottom: 40px;
            margin-bottom: 20px;
        }
        
        .slide-number {
            position: absolute;
            bottom: 10px;
            right: 20px;
            color: rgba(255, 255, 255, 0.5);
            font-size: 0.9rem;
        }
        
        .visualization {
            margin: 20px 0;
            padding: 15px;
            background-color: rgba(255, 255, 255, 0.05);
            border-radius: 8px;
        }
        
        .visualization h5 {
            margin-bottom: 15px;
            color: #00cec9;
        }
        
        .bar-chart {
            display: flex;
            height: 200px;
            align-items: flex-end;
            gap: 15px;
            padding: 0 15px;
        }
        
        .bar-container {
            display: flex;
            flex-direction: column;
            align-items: center;
            flex: 1;
        }
        
        .bar {
            width: 100%;
            position: relative;
            border-radius: 5px 5px 0 0;
            transition: height 0.5s ease;
        }
        
        .bar span {
            position: absolute;
            top: -25px;
            left: 0;
            right: 0;
            text-align: center;
            font-size: 0.8rem;
        }
        
        .bar-container label {
            margin-top: 5px;
            font-size: 0.8rem;
            text-align: center;
            color: rgba(255, 255, 255, 0.7);
        }
        
        .process-diagram {
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 5px;
        }
        
        .process-step {
            border: 2px solid;
            border-radius: 8px;
            padding: 10px;
            text-align: center;
            position: relative;
        }
        
        .step-arrow {
            width: 15px;
            height: 2px;
            position: relative;
        }
        
        .step-arrow::after {
            content: '';
            position: absolute;
            right: 0;
            top: -3px;
            width: 0;
            height: 0;
            border-top: 4px solid transparent;
            border-bottom: 4px solid transparent;
            border-left: 6px solid inherit;
        }
        
        .alert-box {
            position: fixed;
            bottom: 20px;
            right: 20px;
            background-color: #00b894;
            color: white;
            padding: 15px 20px;
            border-radius: 8px;
            display: flex;
            align-items: center;
            gap: 15px;
            box-shadow: 0 3px 10px rgba(0, 0, 0, 0.2);
            z-index: 1000;
            animation: slideIn 0.3s ease;
        }
        
        .alert-box.fade-out {
            animation: fadeOut 0.3s ease forwards;
        }
        
        .alert-box .close-alert {
            background: none;
            border: none;
            color: white;
            cursor: pointer;
            font-size: 1rem;
        }
        
        @keyframes slideIn {
            from { transform: translateX(100%); opacity: 0; }
            to { transform: translateX(0); opacity: 1; }
        }
        
        @keyframes fadeOut {
            to { transform: translateX(100%); opacity: 0; }
        }
    `;
    
    document.head.appendChild(dynamicStyles);
});
