import { useState } from 'react';
import { SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const App = () => {
  // ===== ESTADOS (VARIÁVEIS) DA CALCULADORA =====
  
  // Estado que controla o que aparece no display principal (valor atual)
  const [display, setDisplay] = useState('0');
  
  // Estado que armazena o primeiro número da operação (valor anterior digitado)
  const [valorAnterior, setValorAnterior] = useState(null);
  
  // Estado que armazena qual operação foi selecionada (+, -, *, /)
  const [operacao, setOperacao] = useState(null);
  
  // Estado que controla se estamos aguardando um novo número após uma operação
  const [aguardandoNovoNumero, setAguardandoNovoNumero] = useState(true);
  
  // Estado que armazena a expressão matemática completa para exibição
  const [expressaoCompleta, setExpressaoCompleta] = useState('');

  // ===== FUNÇÕES DA CALCULADORA =====

  // Função para inserir números no display
  const inserirNumero = (numero) => {
    if (aguardandoNovoNumero) {
      // Se está aguardando novo número, substitui o display pelo número clicado
      setDisplay(numero);
      setAguardandoNovoNumero(false);
    } else {
      // Se não está aguardando, concatena o número ao que já está no display
      // Se o display for "0", substitui pelo número (evita "01")
      setDisplay(display === '0' ? numero : display + numero);
    }
  };

  // Função para inserir ponto decimal (vírgula)
  const inserirPonto = () => {
    if (aguardandoNovoNumero) {
      // Se está aguardando novo número, inicia com "0,"
      setDisplay('0,');
      setAguardandoNovoNumero(false);
    } else if (!display.includes(',')) {
      // Se não tem vírgula ainda, adiciona uma
      setDisplay(display + ',');
    }
    // Se já tem vírgula, não faz nada (evita múltiplas vírgulas)
  };

  // Função para limpar toda a calculadora (botão C)
  const limpar = () => {
    setDisplay('0');                    // Zera o display
    setValorAnterior(null);             // Limpa o valor anterior
    setOperacao(null);                  // Limpa a operação
    setAguardandoNovoNumero(true);      // Volta a aguardar novo número
    setExpressaoCompleta('');           // Limpa a expressão completa
  };

  // Função executada quando o usuário clica em uma operação (+, -, *, /)
  const executarOperacao = (proximaOperacao) => {
    // Converte o valor do display de string para número, trocando vírgula por ponto
    const valorAtual = parseFloat(display.replace(',', '.'));

    if (valorAnterior === null) {
      // Primeira operação: armazena o valor atual e inicia a expressão
      setValorAnterior(valorAtual);
      setExpressaoCompleta(`${display} ${proximaOperacao} `);
    } else if (operacao) {
      // Continuação de operação: calcula o resultado anterior e usa como novo valor
      const resultado = calcular();
      setDisplay(String(resultado).replace('.', ','));
      setValorAnterior(resultado);
      setExpressaoCompleta(`${resultado} ${proximaOperacao} `);
    } else {
      // Apenas atualiza a expressão com o novo operador
      setExpressaoCompleta(expressaoCompleta + `${display} ${proximaOperacao} `);
    }

    // Prepara para receber o próximo número
    setAguardandoNovoNumero(true);
    // Armazena a operação selecionada
    setOperacao(proximaOperacao);
  };

  // Função que realiza o cálculo matemático
  const calcular = () => {
    // Converte o display atual para número
    const valorAtual = parseFloat(display.replace(',', '.'));
    // Começa com o valor anterior armazenado
    let calculo = valorAnterior;

    // Executa a operação matemática baseada no operador selecionado
    switch (operacao) {
      case '+':
        calculo += valorAtual;  // Soma
        break;
      case '-':
        calculo -= valorAtual;  // Subtração
        break;
      case '*':
        calculo *= valorAtual;  // Multiplicação
        break;
      case '/':
        // Divisão com proteção contra divisão por zero
        calculo = valorAtual !== 0 ? calculo / valorAtual : 0;
        break;
      default:
        // Se não há operação, retorna o valor atual
        return valorAtual;
    }

    return calculo;  // Retorna o resultado do cálculo
  };

  // Função executada quando o usuário clica no "="
  const igual = () => {
    // Só calcula se há uma operação e não está aguardando novo número
    if (operacao && !aguardandoNovoNumero) {
      const resultado = calcular();  // Calcula o resultado
      // Monta a expressão final completa (ex: "1 + 3 = 4")
      const expressaoFinal = `${expressaoCompleta}${display} = ${String(resultado).replace('.', ',')}`;
      
      setDisplay(String(resultado).replace('.', ','));  // Mostra o resultado no display
      setExpressaoCompleta(expressaoFinal);            // Atualiza a expressão completa
      setValorAnterior(null);                          // Reseta o valor anterior
      setOperacao(null);                               // Reseta a operação
      setAguardandoNovoNumero(true);                   // Prepara para novo cálculo
    }
  };

  // ===== COMPONENTE REUTILIZÁVEL PARA BOTÕES =====
  
  // Componente personalizado para os botões da calculadora
  const Botao = ({ titulo, onPress, estilo }) => (
    <TouchableOpacity 
      style={[styles.botao, estilo]}  // Combina estilo base com estilo personalizado
      onPress={onPress}               // Função executada ao clicar
    >
      <Text style={styles.textoBotao}>{titulo}</Text>
    </TouchableOpacity>
  );

  // ===== INTERFACE DA CALCULADORA =====
  
  return (
    <SafeAreaView style={styles.container}>
      {/* Cabeçalho com identificação do aluno */}
      <View style={styles.cabecalho}>
        <Text style={styles.textoCabecalho}>Mateus Martins - RA: 2023103773</Text>
      </View>

      {/* Área do display onde os números e resultados são mostrados */}
      <View style={styles.displayContainer}>
        {/* Display principal - mostra o número atual ou resultado */}
        <Text style={styles.displayTexto}>{display}</Text>
        
        {/* Display secundário - mostra a expressão matemática completa */}
        {expressaoCompleta !== '' && (
          <Text style={styles.expressaoTexto}>{expressaoCompleta}</Text>
        )}
      </View>

      {/* Teclado com todos os botões da calculadora */}
      <View style={styles.teclado}>

        {/* Primeira linha: Limpar (C) e Divisão (/) */}
        <View style={styles.linha}>
          <Botao titulo="C" onPress={limpar} estilo={styles.botaoOperacao} />
          <View style={styles.botaoVazio} />  {/* Espaço vazio para alinhamento */}
          <View style={styles.botaoVazio} />  {/* Espaço vazio para alinhamento */}
          <Botao titulo="/" onPress={() => executarOperacao('/')} estilo={styles.botaoOperacao} />
        </View>

        {/* Segunda linha: Números 7, 8, 9 e Multiplicação (*) */}
        <View style={styles.linha}>
          <Botao titulo="7" onPress={() => inserirNumero('7')} />
          <Botao titulo="8" onPress={() => inserirNumero('8')} />
          <Botao titulo="9" onPress={() => inserirNumero('9')} />
          <Botao titulo="*" onPress={() => executarOperacao('*')} estilo={styles.botaoOperacao} />
        </View>

        {/* Terceira linha: Números 4, 5, 6 e Subtração (-) */}
        <View style={styles.linha}>
          <Botao titulo="4" onPress={() => inserirNumero('4')} />
          <Botao titulo="5" onPress={() => inserirNumero('5')} />
          <Botao titulo="6" onPress={() => inserirNumero('6')} />
          <Botao titulo="-" onPress={() => executarOperacao('-')} estilo={styles.botaoOperacao} />
        </View>

        {/* Quarta linha: Números 1, 2, 3 e Adição (+) */}
        <View style={styles.linha}>
          <Botao titulo="1" onPress={() => inserirNumero('1')} />
          <Botao titulo="2" onPress={() => inserirNumero('2')} />
          <Botao titulo="3" onPress={() => inserirNumero('3')} />
          <Botao titulo="+" onPress={() => executarOperacao('+')} estilo={styles.botaoOperacao} />
        </View>

        {/* Quinta linha: Zero, Vírgula e Igual (=) */}
        <View style={styles.linha}>
          <Botao titulo="0" onPress={() => inserirNumero('0')} />
          <Botao titulo="," onPress={inserirPonto} />
          {/* Botão igual ocupa 2 espaços (flex: 2) */}
          <Botao titulo="=" onPress={igual} estilo={[styles.botaoIgual, { flex: 2 }]} />
        </View>
      </View>
    </SafeAreaView>
  );
};

// ===== ESTILOS DA CALCULADORA =====

const styles = StyleSheet.create({
  // Container principal - ocupa toda a tela
  container: {
    flex: 1,                    // Ocupa todo o espaço disponível
    backgroundColor: '#f0f0f0', // Cor de fundo cinza claro
  },
  // Cabeçalho com nome e RA
  cabecalho: {
    padding: 20,                // Espaçamento interno
    alignItems: 'center',       // Centraliza o conteúdo
    backgroundColor: '#fff',    // Fundo branco
    borderBottomWidth: 1,       // Linha inferior
    borderBottomColor: '#ddd',  // Cor da linha inferior
  },
  // Texto do cabeçalho
  textoCabecalho: {
    fontSize: 18,               // Tamanho da fonte
    fontWeight: 'bold',         // Texto em negrito
  },
  // Container do display
  displayContainer: {
    backgroundColor: '#fff',    // Fundo branco
    margin: 20,                 // Margem externa
    padding: 20,                // Espaçamento interno
    borderRadius: 10,           // Bordas arredondadas
    alignItems: 'flex-end',     // Alinha conteúdo à direita
    minHeight: 120,             // Altura mínima
    justifyContent: 'center',   // Centraliza verticalmente
  },
  // Texto principal do display (número atual)
  displayTexto: {
    fontSize: 40,               // Tamanho grande para melhor visibilidade
    fontWeight: 'bold',         // Negrito
    color: '#333',              // Cor escura
  },
  // Texto da expressão completa (cálculo)
  expressaoTexto: {
    fontSize: 16,               // Tamanho menor
    color: '#666',              // Cor cinza
    marginTop: 5,               // Espaço acima
  },
  // Container do teclado
  teclado: {
    flex: 2,                    // Ocupa 2/3 do espaço disponível
    margin: 50,                 // Margem generosa
  },
  // Linha do teclado
  linha: {
    flex: 1,                    // Cada linha ocupa espaço igual
    flexDirection: 'row',       // Organiza os botões em linha
    justifyContent: 'space-between', // Espaça os botões igualmente
    marginBottom: 10,           // Espaço entre linhas
  },
  // Estilo base dos botões
  botao: {
    flex: 1,                    // Cada botão ocupa espaço igual na linha
    backgroundColor: '#fff',    // Fundo branco
    margin: 10,                 // Margem entre botões
    borderRadius: 10,           // Bordas arredondadas
    justifyContent: 'center',   // Centraliza conteúdo verticalmente
    alignItems: 'center',       // Centraliza conteúdo horizontalmente
  },
  // Texto dentro dos botões
  textoBotao: {
    fontSize: 24,               // Tamanho confortável para toque
    fontWeight: 'bold',         // Negrito
    color: '#333',              // Cor escura
  },
  // Estilo para botões de operação (+, -, *, /)
  botaoOperacao: {
    backgroundColor: '#ccc',    // Cor diferente para operações
  },
  // Estilo para botão de igual
  botaoIgual: {
    backgroundColor: '#ccc',    // Mesma cor das operações
  },
  // Botão vazio (para preencher espaços e manter alinhamento)
  botaoVazio: {
    flex: 1,                    // Ocupa mesmo espaço que um botão
    margin: 5,                  // Margem reduzida
  },
});

export default App;