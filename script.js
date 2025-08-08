// Inicialização do jsPDF
const { jsPDF } = window.jspdf;

document.addEventListener('DOMContentLoaded', function() {
    // Elementos da interface
    const searchBtn = document.getElementById('searchBtn');
    const searchInput = document.getElementById('searchInput');
    const difficultyLevel = document.getElementById('difficultyLevel');
    const savedLessonsLink = document.getElementById('savedLessonsLink');
    const savedLessonsContainer = document.getElementById('savedLessonsContainer');
    const savedLessonsSection = document.getElementById('savedLessonsSection');
    const lessonModal = document.getElementById('lessonModal');
    const closeBtn = document.querySelector('.close-btn');
    const slidesContainer = document.getElementById('slidesContainer');
    const modalTitle = document.getElementById('modalTitle');
    const lessonTopic = document.getElementById('lessonTopic');
    const saveLessonBtn = document.getElementById('saveLesson');
    const downloadPdfBtn = document.getElementById('downloadPdf');
    const shareLessonBtn = document.getElementById('shareLesson');

    // Mostrar/ocultar seção de aulas salvas
    savedLessonsLink.addEventListener('click', function(e) {
        e.preventDefault();
        savedLessonsSection.style.display = savedLessonsSection.style.display === 'none' ? 'block' : 'none';
        loadSavedLessons();
    });

    // Fechar modal
    closeBtn.addEventListener('click', function() {
        lessonModal.style.display = 'none';
    });

    // Gerar aula ao clicar no botão
    searchBtn.addEventListener('click', generateLesson);
    
    // Gerar aula ao pressionar Enter
    searchInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            generateLesson();
        }
    });

    // Função principal para gerar a aula
    function generateLesson() {
        const topic = searchInput.value.trim();
        const difficulty = difficultyLevel.value;
        
        if (!topic) {
            alert('Por favor, digite um tema para a aula.');
            return;
        }
        
        // Mostrar loading
        slidesContainer.innerHTML = '<div class="loading"><i class="fas fa-spinner fa-spin"></i> Gerando aula...</div>';
        lessonModal.style.display = 'block';
        lessonTopic.textContent = topic;
        modalTitle.textContent = `Aula Gerada: ${topic} (${difficulty})`;
        
        // Simular um tempo de processamento (em uma aplicação real, seria uma chamada API)
        setTimeout(() => {
            const lessonContent = createLessonContent(topic, difficulty);
            displayLessonSlides(lessonContent);
        }, 1500);
    }
    
    // Criar conteúdo da aula com base no tema e dificuldade
    function createLessonContent(topic, difficulty) {
        // Conteúdo baseado no nível de dificuldade
        const difficultySettings = {
            'básico': {
                depth: 'superficial',
                examples: 2,
                complexity: 'simples'
            },
            'intermediário': {
                depth: 'moderado',
                examples: 3,
                complexity: 'média'
            },
            'avançado': {
                depth: 'aprofundado',
                examples: 4,
                complexity: 'alta'
            }
        };
        
        const settings = difficultySettings[difficulty];
        
        // Gerar conteúdo fictício (em uma aplicação real, isso viria de uma API de IA)
        const lesson = {
            title: topic,
            difficulty: difficulty,
            slides: []
        };
        
        // Slide de introdução
        lesson.slides.push({
            type: 'title',
            content: {
                title: `Aula sobre ${topic}`,
                subtitle: `Nível: ${difficulty}`,
                description: `Esta aula abordará os conceitos principais sobre ${topic} em um nível ${difficulty}.`
            }
        });
        
        // Slide de definição
        lesson.slides.push({
            type: 'definition',
            content: {
                title: `O que é ${topic}?`,
                definition: generateDefinition(topic, difficulty),
                image: getRandomImage(topic)
            }
        });
        
        // Slide de histórico/contexto (se aplicável)
        if (Math.random() > 0.3) { // 70% de chance de incluir
            lesson.slides.push({
                type: 'context',
                content: {
                    title: `Contexto histórico de ${topic}`,
                    text: generateHistoricalContext(topic),
                    timeline: generateTimeline(topic)
                }
            });
        }
        
        // Slides de conceitos principais
        const mainConcepts = generateMainConcepts(topic, difficulty);
        mainConcepts.forEach(concept => {
            lesson.slides.push({
                type: 'concept',
                content: {
                    title: concept.title,
                    description: concept.description,
                    example: concept.example,
                    image: concept.image
                }
            });
        });
        
        // Slide de exemplos
        lesson.slides.push({
            type: 'examples',
            content: {
                title: `Exemplos de ${topic}`,
                items: generateExamples(topic, settings.examples)
            }
        });
        
        // Slide de aplicações práticas
        if (Math.random() > 0.2) { // 80% de chance de incluir
            lesson.slides.push({
                type: 'applications',
                content: {
                    title: `Aplicações de ${topic}`,
                    items: generateApplications(topic)
                }
            });
        }
        
        // Slide de exercícios
        lesson.slides.push({
            type: 'exercises',
            content: {
                title: `Exercícios sobre ${topic}`,
                items: generateExercises(topic, difficulty)
            }
        });
        
        // Slide de conclusão
        lesson.slides.push({
            type: 'conclusion',
            content: {
                title: `Conclusão sobre ${topic}`,
                summary: generateSummary(topic),
                furtherReading: generateFurtherReading(topic)
            }
        });
        
        return lesson;
    }
    
    // Funções auxiliares para gerar conteúdo fictício
    function generateDefinition(topic, difficulty) {
        const definitions = {
            'básico': `Em termos simples, ${topic} é um conceito fundamental que trata de...`,
            'intermediário': `${topic} pode ser definido como um processo/conceito que envolve...`,
            'avançado': `Do ponto de vista técnico, ${topic} refere-se a um conjunto complexo de princípios que...`
        };
        
        return definitions[difficulty] || definitions['intermediário'];
    }
    
    function generateHistoricalContext(topic) {
        const contexts = [
            `O estudo de ${topic} remonta ao século XX, quando pesquisadores começaram a...`,
            `${topic} tem suas origens na antiguidade, com os primeiros registros aparecendo em...`,
            `A compreensão moderna de ${topic} surgiu na década de 1950, após a descoberta de...`,
            `${topic} foi desenvolvido como resposta às limitações do modelo anterior de...`
        ];
        
        return contexts[Math.floor(Math.random() * contexts.length)];
    }
    
    function generateTimeline(topic) {
        const years = [1800, 1850, 1900, 1950, 2000].sort(() => Math.random() - 0.5).slice(0, 3);
        return years.map(year => ({
            year: year,
            event: `Evento importante relacionado a ${topic} ocorreu neste ano`
        }));
    }
    
    function generateMainConcepts(topic, difficulty) {
        const count = difficulty === 'básico' ? 2 : difficulty === 'intermediário' ? 3 : 4;
        const concepts = [];
        
        for (let i = 1; i <= count; i++) {
            concepts.push({
                title: `Princípio ${i} de ${topic}`,
                description: `Este princípio explica como ${topic} funciona em relação a...`,
                example: `Por exemplo, quando aplicamos este princípio a uma situação real...`,
                image: getRandomImage(topic)
            });
        }
        
        return concepts;
    }
    
    function generateExamples(topic, count) {
        const examples = [];
        
        for (let i = 1; i <= count; i++) {
            examples.push({
                title: `Exemplo ${i}`,
                description: `Um exemplo claro de ${topic} pode ser visto quando...`,
                image: getRandomImage(topic)
            });
        }
        
        return examples;
    }
    
    function generateApplications(topic) {
        const apps = [
            `Na medicina, ${topic} é usado para...`,
            `Engenheiros aplicam ${topic} para resolver problemas como...`,
            `No dia a dia, podemos ver ${topic} em ação quando...`,
            `A tecnologia moderna depende de ${topic} para...`
        ];
        
        return apps.sort(() => Math.random() - 0.5).slice(0, 3);
    }
    
    function generateExercises(topic, difficulty) {
        const count = difficulty === 'básico' ? 2 : difficulty === 'intermediário' ? 3 : 4;
        const exercises = [];
        
        for (let i = 1; i <= count; i++) {
            exercises.push({
                question: `Questão ${i}: Como você explicaria ${topic} em uma situação onde...?`,
                hint: `Dica: Pense sobre os princípios fundamentais de ${topic}.`
            });
        }
        
        return exercises;
    }
    
    function generateSummary(topic) {
        return `Nesta aula, exploramos os conceitos fundamentais de ${topic}, incluindo seus princípios básicos, aplicações práticas e exemplos relevantes. ${topic} é um campo importante porque...`;
    }
    
    function generateFurtherReading(topic) {
        return [
            `Livro: "Introdução a ${topic}" por Autor Famoso`,
            `Artigo: "Avanços recentes em ${topic}" (2023)`,
            `Site: www.${topic.toLowerCase().replace(/\s/g, '')}.edu.br`
        ];
    }
    
    function getRandomImage(topic) {
        // Em uma aplicação real, isso buscaria imagens reais relacionadas ao tópico
        const categories = ['science', 'math', 'history', 'art', 'technology'];
        const randomCat = categories[Math.floor(Math.random() * categories.length)];
        return `https://source.unsplash.com/300x200/?${randomCat},${topic.split(' ')[0]}`;
    }
    
    // Exibir os slides no modal
    function displayLessonSlides(lesson) {
        slidesContainer.innerHTML = '';
        
        lesson.slides.forEach((slide, index) => {
            const slideElement = document.createElement('div');
            slideElement.className = `slide ${slide.type}`;
            slideElement.innerHTML = createSlideHTML(slide, index + 1, lesson.slides.length);
            slidesContainer.appendChild(slideElement);
        });
        
        // Atualizar eventos dos botões
        saveLessonBtn.onclick = () => saveLesson(lesson);
        downloadPdfBtn.onclick = () => downloadAsPdf(lesson);
        shareLessonBtn.onclick = () => shareLesson(lesson);
    }
    
    // Criar HTML para cada tipo de slide
    function createSlideHTML(slide, current, total) {
        let html = `<div class="slide-header">
            <span class="slide-number">${current}/${total}</span>
            <h4>${slide.content.title}</h4>
        </div>`;
        
        switch(slide.type) {
            case 'title':
                html += `
                    <div class="slide-body">
                        <h2>${slide.content.title}</h2>
                        <h3>${slide.content.subtitle}</h3>
                        <p>${slide.content.description}</p>
                        <div class="title-image">
                            <img src="${getRandomImage(slide.content.title)}" alt="${slide.content.title}">
                        </div>
                    </div>
                `;
                break;
                
            case 'definition':
                html += `
                    <div class="slide-body">
                        <div class="definition-text">
                            <p>${slide.content.definition}</p>
                        </div>
                        <div class="definition-image">
                            <img src="${slide.content.image}" alt="Definição de ${slide.content.title}">
                            <p class="image-caption">Ilustração relacionada a ${slide.content.title}</p>
                        </div>
                    </div>
                `;
                break;
                
            case 'context':
                html += `
                    <div class="slide-body">
                        <div class="context-text">
                            <p>${slide.content.text}</p>
                        </div>
                        <div class="timeline">
                            ${slide.content.timeline.map(item => `
                                <div class="timeline-item">
                                    <div class="timeline-year">${item.year}</div>
                                    <div class="timeline-event">${item.event}</div>
                                </div>
                            `).join('')}
                        </div>
                    </div>
                `;
                break;
                
            case 'concept':
                html += `
                    <div class="slide-body">
                        <div class="concept-text">
                            <h5>${slide.content.title}</h5>
                            <p>${slide.content.description}</p>
                            <div class="example">
                                <strong>Exemplo:</strong>
                                <p>${slide.content.example}</p>
                            </div>
                        </div>
                        <div class="concept-image">
                            <img src="${slide.content.image}" alt="${slide.content.title}">
                        </div>
                    </div>
                `;
                break;
                
            case 'examples':
                html += `
                    <div class="slide-body">
                        ${slide.content.items.map((item, i) => `
                            <div class="example-item ${i % 2 === 0 ? 'left' : 'right'}">
                                <h5>${item.title}</h5>
                                <p>${item.description}</p>
                                ${item.image ? `<img src="${item.image}" alt="${item.title}">` : ''}
                            </div>
                        `).join('')}
                    </div>
                `;
                break;
                
            case 'applications':
                html += `
                    <div class="slide-body">
                        <ul class="applications-list">
                            ${slide.content.items.map(item => `
                                <li>
                                    <i class="fas fa-check-circle"></i>
                                    <span>${item}</span>
                                </li>
                            `).join('')}
                        </ul>
                        <div class="applications-image">
                            <img src="${getRandomImage(slide.content.title)}" alt="Aplicações">
                        </div>
                    </div>
                `;
                break;
                
            case 'exercises':
                html += `
                    <div class="slide-body">
                        ${slide.content.items.map(item => `
                            <div class="exercise-item">
                                <h5>${item.question}</h5>
                                <div class="hint">
                                    <button class="show-hint">Mostrar dica</button>
                                    <p class="hint-text" style="display: none;">${item.hint}</p>
                                </div>
                            </div>
                        `).join('')}
                    </div>
                `;
                break;
                
            case 'conclusion':
                html += `
                    <div class="slide-body">
                        <div class="summary">
                            <h5>Resumo</h5>
                            <p>${slide.content.summary}</p>
                        </div>
                        <div class="further-reading">
                            <h5>Para saber mais:</h5>
                            <ul>
                                ${slide.content.furtherReading.map(item => `
                                    <li>${item}</li>
                                `).join('')}
                            </ul>
                        </div>
                    </div>
                `;
                break;
        }
        
        return html;
    }
    
    // Salvar aula no localStorage
    function saveLesson(lesson) {
        let savedLessons = JSON.parse(localStorage.getItem('savedLessons')) || [];
        
        // Verificar se a aula já foi salva
        if (savedLessons.some(l => l.title === lesson.title)) {
            alert('Esta aula já foi salva anteriormente.');
            return;
        }
        
        // Limitar a 20 aulas salvas
        if (savedLessons.length >= 20) {
            savedLessons.shift(); // Remove a mais antiga
        }
        
        savedLessons.push({
            title: lesson.title,
            difficulty: lesson.difficulty,
            date: new Date().toLocaleDateString(),
            slidesCount: lesson.slides.length
        });
        
        localStorage.setItem('savedLessons', JSON.stringify(savedLessons));
        alert('Aula salva com sucesso!');
        loadSavedLessons();
    }
    
    // Carregar aulas salvas
    function loadSavedLessons() {
        const savedLessons = JSON.parse(localStorage.getItem('savedLessons')) || [];
        savedLessonsContainer.innerHTML = '';
        
        if (savedLessons.length === 0) {
            savedLessonsContainer.innerHTML = '<p class="no-lessons">Nenhuma aula salva ainda.</p>';
            return;
        }
        
        savedLessons.reverse().forEach(lesson => {
            const lessonElement = document.createElement('div');
            lessonElement.className = 'lesson-card';
            lessonElement.innerHTML = `
                <h4>${lesson.title}</h4>
                <div class="lesson-meta">
                    <span class="difficulty ${lesson.difficulty}">${lesson.difficulty}</span>
                    <span class="date">${lesson.date}</span>
                    <span class="slides">${lesson.slidesCount} slides</span>
                </div>
                <button class="view-lesson" data-title="${lesson.title}">Ver Aula</button>
                <button class="delete-lesson" data-title="${lesson.title}"><i class="fas fa-trash"></i></button>
            `;
            savedLessonsContainer.appendChild(lessonElement);
        });
        
        // Adicionar eventos aos botões
        document.querySelectorAll('.view-lesson').forEach(btn => {
            btn.addEventListener('click', function() {
                const title = this.getAttribute('data-title');
                viewSavedLesson(title);
            });
        });
        
        document.querySelectorAll('.delete-lesson').forEach(btn => {
            btn.addEventListener('click', function() {
                const title = this.getAttribute('data-title');
                deleteSavedLesson(title);
            });
        });
    }
    
    // Visualizar aula salva
    function viewSavedLesson(title) {
        // Em uma aplicação real, isso recuperaria o conteúdo completo da aula
        // Aqui vamos apenas simular gerando uma nova aula com o mesmo título
        const savedLessons = JSON.parse(localStorage.getItem('savedLessons')) || [];
        const lessonInfo = savedLessons.find(l => l.title === title);
        
        if (lessonInfo) {
            const lessonContent = createLessonContent(title, lessonInfo.difficulty);
            displayLessonSlides(lessonContent);
            lessonModal.style.display = 'block';
        }
    }
    
    // Excluir aula salva
    function deleteSavedLesson(title) {
        if (confirm(`Tem certeza que deseja excluir a aula "${title}"?`)) {
            let savedLessons = JSON.parse(localStorage.getItem('savedLessons')) || [];
            savedLessons = savedLessons.filter(l => l.title !== title);
            localStorage.setItem('savedLessons', JSON.stringify(savedLessons));
            loadSavedLessons();
        }
    }
    
    // Baixar como PDF
    function downloadAsPdf(lesson) {
        const doc = new jsPDF();
        let yPosition = 20;
        
        // Adicionar cada slide como uma página no PDF
        lesson.slides.forEach((slide, index) => {
            if (index > 0) {
                doc.addPage();
                yPosition = 20;
            }
            
            // Título do slide
            doc.setFontSize(18);
            doc.text(slide.content.title, 15, yPosition);
            yPosition += 10;
            
            // Conteúdo do slide (simplificado para o PDF)
            doc.setFontSize(12);
            
            switch(slide.type) {
                case 'title':
                    doc.text(`Nível: ${lesson.difficulty}`, 15, yPosition + 10);
                    doc.text(slide.content.description, 15, yPosition + 20);
                    break;
                    
                case 'definition':
                    doc.text(slide.content.definition, 15, yPosition + 10, { maxWidth: 180 });
                    break;
                    
                case 'context':
                    doc.text(slide.content.text, 15, yPosition + 10, { maxWidth: 180 });
                    slide.content.timeline.forEach((item, i) => {
                        doc.text(`${item.year}: ${item.event}`, 15, yPosition + 30 + (i * 10));
                    });
                    break;
                    
                case 'concept':
                    doc.text(slide.content.description, 15, yPosition + 10, { maxWidth: 180 });
                    doc.text(`Exemplo: ${slide.content.example}`, 15, yPosition + 40, { maxWidth: 180 });
                    break;
                    
                case 'examples':
                    slide.content.items.forEach((item, i) => {
                        doc.text(`${item.title}: ${item.description}`, 15, yPosition + 10 + (i * 20), { maxWidth: 180 });
                    });
                    break;
                    
                case 'applications':
                    slide.content.items.forEach((item, i) => {
                        doc.text(`• ${item}`, 15, yPosition + 10 + (i * 10), { maxWidth: 180 });
                    });
                    break;
                    
                case 'exercises':
                    slide.content.items.forEach((item, i) => {
                        doc.text(`${item.question}`, 15, yPosition + 10 + (i * 20), { maxWidth: 180 });
                        doc.text(`Dica: ${item.hint}`, 15, yPosition + 15 + (i * 20), { maxWidth: 180 });
                    });
                    break;
                    
                case 'conclusion':
                    doc.text(slide.content.summary, 15, yPosition + 10, { maxWidth: 180 });
                    doc.text('Para saber mais:', 15, yPosition + 50);
                    slide.content.furtherReading.forEach((item, i) => {
                        doc.text(`• ${item}`, 15, yPosition + 60 + (i * 10));
                    });
                    break;
            }
        });
        
        doc.save(`Aula_${lesson.title.replace(/ /g, '_')}.pdf`);
    }
    
    // Compartilhar aula
    function shareLesson(lesson) {
        if (navigator.share) {
            navigator.share({
                title: `Aula sobre ${lesson.title}`,
                text: `Confira esta aula sobre ${lesson.title} (nível ${lesson.difficulty}) gerada pelo AulaEmergencial`,
                url: window.location.href
            }).catch(err => {
                console.log('Erro ao compartilhar:', err);
                fallbackShare(lesson);
            });
        } else {
            fallbackShare(lesson);
        }
    }
    
    // Fallback para navegadores sem suporte a Web Share API
    function fallbackShare(lesson) {
        const shareText = `Aula sobre ${lesson.title} (${lesson.difficulty}) - ${window.location.href}`;
        prompt('Copie o link para compartilhar:', shareText);
    }
    
    // Inicializar eventos de dicas nos exercícios
    document.addEventListener('click', function(e) {
        if (e.target.classList.contains('show-hint')) {
            const hintText = e.target.nextElementSibling;
            hintText.style.display = hintText.style.display === 'none' ? 'block' : 'none';
            e.target.textContent = hintText.style.display === 'none' ? 'Mostrar dica' : 'Ocultar dica';
        }
    });
    
    // Carregar aulas salvas ao iniciar
    loadSavedLessons();
});
