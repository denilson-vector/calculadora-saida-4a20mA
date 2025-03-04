// Funções da tela principal (index.html)
if (document.getElementById('calcular')) {
    const calcularBtn = document.getElementById('calcular');
    const multimetroInput = document.getElementById('multimetro');
    const fundoEscalaInput = document.getElementById('fundoEscala');
    const resultadoValor = document.getElementById('resultadoValor');

    calcularBtn.addEventListener('click', () => {
        if (calcularBtn.textContent === 'Calcular') {
            // Realiza o cálculo
            const multimetro = parseFloat(multimetroInput.value);
            const fundoEscala = parseFloat(fundoEscalaInput.value);

            if (isNaN(multimetro) || isNaN(fundoEscala)) {
                alert('Por favor, insira valores válidos.');
                return;
            }

            const resultado = ((multimetro - 4) * fundoEscala) / 16;
            resultadoValor.textContent = resultado.toFixed(2);

            // Altera o texto do botão para "Limpar" e adiciona a classe CSS
            calcularBtn.textContent = 'Limpar';
            calcularBtn.classList.add('limpar');
        } else {
            // Limpa os campos e o resultado
            multimetroInput.value = '';
            fundoEscalaInput.value = '';
            resultadoValor.textContent = '0';

            // Altera o texto do botão de volta para "Calcular" e remove a classe CSS
            calcularBtn.textContent = 'Calcular';
            calcularBtn.classList.remove('limpar');
        }
    });
}

// Funções da tela de cálculo do Fator K (fator-k.html)
if (document.getElementById('calcularFatorK')) {
    const calcularFatorKBtn = document.getElementById('calcularFatorK');
    const fatorKAtualInput = document.getElementById('fatorKAtual');
    const vazaoDisplayInput = document.getElementById('vazaoDisplay');
    const vazaoMaletaInput = document.getElementById('vazaoMaleta');
    const resultadoFatorK = document.getElementById('resultadoFatorK');

    calcularFatorKBtn.addEventListener('click', () => {
        if (calcularFatorKBtn.textContent === 'Calcular Fator K') {
            // Realiza o cálculo
            const fatorKAtual = parseFloat(fatorKAtualInput.value);
            const vazaoDisplay = parseFloat(vazaoDisplayInput.value);
            const vazaoMaleta = parseFloat(vazaoMaletaInput.value);

            if (isNaN(fatorKAtual) || isNaN(vazaoDisplay) || isNaN(vazaoMaleta)) {
                alert('Por favor, insira valores válidos.');
                return;
            }

            const novoFatorK = (fatorKAtual * vazaoMaleta) / vazaoDisplay;
            resultadoFatorK.textContent = novoFatorK.toFixed(4);

            // Altera o texto do botão para "Limpar" e adiciona a classe CSS
            calcularFatorKBtn.textContent = 'Limpar';
            calcularFatorKBtn.classList.add('limpar');
        } else {
            // Limpa os campos e o resultado
            fatorKAtualInput.value = '';
            vazaoDisplayInput.value = '';
            vazaoMaletaInput.value = '';
            resultadoFatorK.textContent = '0';

            // Altera o texto do botão de volta para "Calcular Fator K" e remove a classe CSS
            calcularFatorKBtn.textContent = 'Calcular Fator K';
            calcularFatorKBtn.classList.remove('limpar');
        }
    });
}

// Modo Noturno (compartilhado entre as páginas)
function toggleModoNoturno() {
    const body = document.body;
    const botaoModoNoturno = document.getElementById('modoNoturno');

    body.classList.toggle('dark-mode');
    const modoNoturnoAtivo = body.classList.contains('dark-mode');

    if (modoNoturnoAtivo) {
        botaoModoNoturno.textContent = 'Modo Noturno Ativado';
    } else {
        botaoModoNoturno.textContent = 'Modo Noturno Desativado';
    }

    localStorage.setItem('modoNoturno', modoNoturnoAtivo);
}

if (document.getElementById('modoNoturno')) {
    document.getElementById('modoNoturno').addEventListener('click', toggleModoNoturno);
}

// Verificar o modo noturno ao carregar a página (compartilhado entre as páginas)
window.addEventListener('load', () => {
    const modoNoturnoSalvo = localStorage.getItem('modoNoturno') === 'true';
    const botaoModoNoturno = document.getElementById('modoNoturno');

    if (modoNoturnoSalvo) {
        document.body.classList.add('dark-mode');
        if (botaoModoNoturno) {
            botaoModoNoturno.textContent = 'Modo Noturno Ativado';
        }
    } else {
        if (botaoModoNoturno) {
            botaoModoNoturno.textContent = 'Modo Noturno Desativado';
        }
        verificarModoNoturnoAutomatico();
    }
});

// Verificar modo noturno automaticamente com base na localização
function verificarModoNoturnoAutomatico() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            (position) => {
                const lat = position.coords.latitude;
                const lon = position.coords.longitude;
                fetch(`https://api.sunrise-sunset.org/json?lat=${lat}&lng=${lon}&formatted=0`)
                    .then(response => response.json())
                    .then(data => {
                        const agora = new Date();
                        const nascerSol = new Date(data.results.sunrise);
                        const porSol = new Date(data.results.sunset);

                        if (agora < nascerSol || agora > porSol) {
                            document.body.classList.add('dark-mode');
                            if (document.getElementById('modoNoturno')) {
                                document.getElementById('modoNoturno').textContent = 'Modo Noturno Ativado';
                            }
                            localStorage.setItem('modoNoturno', true);
                        }
                    })
                    .catch((error) => {
                        console.error('Erro ao buscar dados do nascer/pôr do sol:', error);
                        definirModoNoturnoPorHorario(); // Fallback para horário do dispositivo
                    });
            },
            (error) => {
                console.error('Erro ao obter localização:', error);
                definirModoNoturnoPorHorario(); // Fallback para horário do dispositivo
            }
        );
    } else {
        console.log('Geolocalização não suportada pelo navegador.');
        definirModoNoturnoPorHorario(); // Fallback para horário do dispositivo
    }
}

// Fallback para horário do dispositivo
function definirModoNoturnoPorHorario() {
    const agora = new Date();
    const hora = agora.getHours();

    if (hora >= 18 || hora < 6) {
        document.body.classList.add('dark-mode');
        if (document.getElementById('modoNoturno')) {
            document.getElementById('modoNoturno').textContent = 'Modo Noturno Ativado';
        }
        localStorage.setItem('modoNoturno', true);
    }
}