// Funções da tela principal (index.html)
if (document.getElementById('calcular')) {
    document.getElementById('calcular').addEventListener('click', () => {
        const multimetro = parseFloat(document.getElementById('multimetro').value);
        const fundoEscala = parseFloat(document.getElementById('fundoEscala').value);

        if (isNaN(multimetro) || isNaN(fundoEscala)) {
            alert('Por favor, insira valores válidos.');
            return;
        }

        const resultado = ((multimetro - 4) * fundoEscala) / 16;
        document.getElementById('resultadoValor').textContent = resultado.toFixed(2);
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

// Cálculo do Fator K (página fator-k.html)
if (document.getElementById('calcularFatorK')) {
    document.getElementById('calcularFatorK').addEventListener('click', () => {
        const fatorKAtual = parseFloat(document.getElementById('fatorKAtual').value);
        const vazaoDisplay = parseFloat(document.getElementById('vazaoDisplay').value);
        const vazaoMaleta = parseFloat(document.getElementById('vazaoMaleta').value);

        if (isNaN(fatorKAtual) || isNaN(vazaoDisplay) || isNaN(vazaoMaleta)) {
            alert('Por favor, insira valores válidos.');
            return;
        }

        const novoFatorK = (fatorKAtual * vazaoMaleta) / vazaoDisplay;
        document.getElementById('resultadoFatorK').textContent = novoFatorK.toFixed(4); // Arredondar para 4 casas decimais
    });
}

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