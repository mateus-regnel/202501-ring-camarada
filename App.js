// Importa a biblioteca React e o hook useState do pacote 'react'
// React: biblioteca principal para criar componentes
// useState: hook que permite adicionar estado a componentes funcionais
import React, { useState } from 'react';

// Importa componentes específicos do React Native
// View: container similar à div no HTML, usado para layout
// Text: componente para exibir texto
// TouchableOpacity: botão que diminui a opacidade quando pressionado
// StyleSheet: API para criar estilos
// SafeAreaView: garante que o conteúdo fique dentro da área segura da tela
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView } from 'react-native';

// Define o componente principal da aplicação como uma função componente
// Usa arrow function (=>) para definir o componente
const App = () => {
  // Estado para armazenar o valor atual exibido no display da calculadora
  // useState('0'): inicializa o display com o valor '0'
  // display: valor atual (string)
  // setDisplay: função para atualizar o valor do display
  const [display, setDisplay] = useState('0');

  // Estado para armazenar o primeiro número em uma operação matemática
  // null: indica que não há primeiro número armazenado inicialmente
  // Será preenchido quando o usuário pressionar um operador (+, -, *, /)
  const [primeiroNumero, setPrimeiroNumero] = useState(null);

  // Estado para armazenar a operação matemática atual
  // Pode ser: '+', '-', '*', '/' ou null
  const [operacao, setOperacao] = useState(null);

  // Estado booleano que indica se a calculadora está aguardando o próximo número
  // true: após pressionar um operador, aguarda o próximo número
  // false: está no meio da digitação de um número
  const [aguardandoNumero, setAguardandoNumero] = useState(false);

  // Estado para armazenar a expressão matemática completa
  // Exemplo: "5 + 3 = 8"
  // Usado para mostrar o histórico da operação acima do display principal
  const [expressao, setExpressao] = useState('');

  // Função chamada quando um botão numérico é pressionado
  // Recebe o número (string) como parâmetro
  const lidarComNumero = (num) => {
    // Verifica se o display mostra "0" OU se está aguardando um novo número
    // (após pressionar um operador)
    if (display === '0' || aguardandoNumero) {
      // Substitui o display atual pelo novo número
      // Exemplo: se display era "0" e pressionou "5", display fica "5"
      setDisplay(num);
      
      // Muda o estado para indicar que não está mais aguardando número
      // Permite continuar digitando o mesmo número
      setAguardandoNumero(false);
    } else {
      // Concatena o novo número ao valor atual do display
      // Exemplo: se display era "15" e pressionou "2", display fica "152"
      setDisplay(display + num);
    }
  };

  // Função chamada quando um botão de operação (+, -, *, /) é pressionado
  // Recebe o operador (string) como parâmetro
  const lidarComOperacao = (op) => {
    // Caso 1: Não há primeiro número armazenado ainda (primeira operação)
    if (primeiroNumero === null) {
      // Converte o valor do display de string para número float
      // replace(',', '.'): substitui vírgula por ponto para parseFloat funcionar
      // (formato brasileiro usa vírgula como separador decimal)
      setPrimeiroNumero(parseFloat(display.replace(',', '.')));
      
      // Constrói a expressão visual: "numero operador "
      // Exemplo: se display era "5" e pressionou "+", expressao fica "5 + "
      setExpressao(display + ' ' + op + ' ');
      
      // Reseta o display para "0" para receber o próximo número
      setDisplay('0');
    } 
    // Caso 2: Já existe um primeiro número E não está aguardando novo número
    // (usuário está fazendo operações consecutivas)
    else if (!aguardandoNumero) {
      // Calcula o resultado da operação anterior
      const resultado = calcular();
      
      // Armazena o resultado como novo primeiro número
      setPrimeiroNumero(resultado);
      
      // Atualiza a expressão com o resultado e o novo operador
      // replace('.', ','): converte ponto para vírgula (formato brasileiro)
      // Exemplo: "10 + " (se resultado foi 10 e pressionou "*")
      setExpressao(String(resultado).replace('.', ',') + ' ' + op + ' ');
      
      // Reseta o display para "0"
      setDisplay('0');
    } 
    // Caso 3: Já existe primeiro número E está aguardando número
    // (usuário mudou de ideia sobre qual operação usar)
    else {
      // Substitui o operador anterior pelo novo na expressão
      // slice(0, -2): remove os últimos 2 caracteres (operador anterior e espaço)
      // Exemplo: muda "5 + " para "5 * "
      setExpressao(expressao.slice(0, -2) + op + ' ');
    }
    
    // Define a nova operação atual (comum a todos os casos)
    setOperacao(op);
    
    // Marca que está aguardando o próximo número ser digitado
    setAguardandoNumero(true);
  };

  // Função que realiza o cálculo matemático baseado na operação atual
  // Retorna o resultado da operação
  const calcular = () => {
    // Converte o valor atual do display para número float
    // replace(',', '.'): adapta para formato JavaScript
    const segundoNumero = parseFloat(display.replace(',', '.'));
    
    // Executa switch-case baseado no operador atual
    switch (operacao) {
      case '+': 
        // Soma: primeiroNumero + segundoNumero
        return primeiroNumero + segundoNumero;
      case '-': 
        // Subtração: primeiroNumero - segundoNumero
        return primeiroNumero - segundoNumero;
      case '*': 
        // Multiplicação: primeiroNumero * segundoNumero
        return primeiroNumero * segundoNumero;
      case '/': 
        // Divisão: primeiroNumero / segundoNumero
        return primeiroNumero / segundoNumero;
      default: 
        // Caso padrão: retorna apenas o segundo número
        // (não deveria acontecer em condições normais)
        return segundoNumero;
    }
  };

  // Função chamada quando o botão "=" é pressionado
  // Calcula e exibe o resultado final
  const igual = () => {
    // Verifica se há uma operação válida para calcular:
    // - primeiroNumero não é null (existe um número armazenado)
    // - operacao não é null (existe uma operação)
    // - não está aguardandoNumero (já foi digitado o segundo número)
    if (primeiroNumero !== null && operacao !== null && !aguardandoNumero) {
      // Calcula o resultado da operação
      const resultado = calcular();
      
      // Constrói a expressão completa com resultado
      // Exemplo: "5 + 3 = 8"
      const expressaoCompleta = expressao + display + ' = ' + String(resultado).replace('.', ',');
      
      // Exibe o resultado no display (convertendo ponto para vírgula)
      setDisplay(String(resultado).replace('.', ','));
      
      // Atualiza a expressão histórica com o cálculo completo
      setExpressao(expressaoCompleta);
      
      // Reseta os estados para nova operação
      setPrimeiroNumero(null); // Limpa o primeiro número
      setOperacao(null); // Limpa a operação
      setAguardandoNumero(true); // Marca que aguarda novo número
    }
  };

  // Função para limpar toda a calculadora (botão "C")
  const limpar = () => {
    setDisplay('0'); // Volta display para "0"
    setPrimeiroNumero(null); // Remove primeiro número armazenado
    setOperacao(null); // Remove operação atual
    setAguardandoNumero(false); // Reseta estado de espera
    setExpressao(''); // Limpa expressão histórica
  };

  // Função para adicionar vírgula decimal ao número atual
  const virgula = () => {
    // Caso 1: Está aguardando novo número (após operador)
    if (aguardandoNumero) {
      // Inicia novo número com "0,"
      setDisplay('0,');
      // Muda estado para permitir continuar digitando
      setAguardandoNumero(false);
    } 
    // Caso 2: Não está aguardando número E não tem vírgula no display atual
    else if (display.indexOf(',') === -1) {
      // Adiciona vírgula ao número atual
      // Exemplo: "15" vira "15,"
      setDisplay(display + ',');
    }
    // Se já tem vírgula, não faz nada (evita múltiplas vírgulas)
  };

  // Retorno do componente (JSX que define a interface)
  return (
    // SafeAreaView: garante que conteúdo não fique sob notch/status bar
    // style: aplica estilos definidos abaixo
    <SafeAreaView style={styles.container}>
      
      {/* Cabeçalho com informações do estudante */}
      <Text style={styles.cabecalho}>Nome: Mateus Martins de Castro Regnel</Text>
      <Text style={styles.cabecalho}>RA: 2023103773</Text>

      {/* Container do display da calculadora */}
      <View style={styles.display}>
        {/* Texto da expressão completa (histórico) */}
        <Text style={styles.expressao}>{expressao}</Text>
        
        {/* Display principal com número atual */}
        <Text style={styles.textoDisplay}>{display}</Text>
      </View>

      {/* Container principal dos botões */}
      <View style={styles.botoes}>
        
        {/* Coluna da esquerda: números e botão C */}
        <View style={styles.colunaNumeros}>
          
          {/* Botão Clear (C) - limpa toda a calculadora */}
          <TouchableOpacity 
            style={[styles.botao, styles.botaoC]} 
            onPress={limpar}
          >
            <Text style={styles.textoBotao}>C</Text>
          </TouchableOpacity>

          {/* Renderiza botões numéricos e vírgula usando map */}
          {['7', '8', '9', '4', '5', '6', '1', '2', '3', '0', ','].map((item) => (
            <TouchableOpacity 
              key={item} // Chave única para cada botão (necessário no React)
              style={[
                styles.botao, 
                styles.botaoNumero, // Estilo base para números
                item === '0' && styles.botaoZero // Estilo especial para botão 0
              ]} 
              // onPress: função chamada quando botão é pressionado
              // Se item é ',', chama virgula(), senão chama lidarComNumero()
              onPress={() => item === ',' ? virgula() : lidarComNumero(item)}
            >
              <Text style={styles.textoBotao}>{item}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Coluna da direita: operadores matemáticos */}
        <View style={styles.colunaOperadores}>
          
          {/* Renderiza botões de operação usando map */}
          {['/', '*', '-', '+', '='].map((item) => (
            <TouchableOpacity 
              key={item}
              style={[
                styles.botao, 
                styles.botaoOperador, // Estilo base para operadores
                item === '=' && styles.botaoIgual // Estilo especial para igual
              ]} 
              // Se item é '=', chama igual(), senão chama lidarComOperacao()
              onPress={() => item === '=' ? igual() : lidarComOperacao(item)}
            >
              <Text style={styles.textoBotao}>{item}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </SafeAreaView>
  );
};

// Define os estilos usando StyleSheet.create (melhor performance)
const styles = StyleSheet.create({
  // Container principal
  container: {
    flex: 1, // Ocupa toda a tela disponível
    padding: 20, // Espaçamento interno de 20 unidades
    paddingTop: 60, // Espaço extra no topo para evitar sobreposição
    backgroundColor: '#fff', // Cor de fundo branca
  },
  
  // Estilo para textos do cabeçalho
  cabecalho: {
    fontSize: 16, // Tamanho da fonte
    fontWeight: 'bold', // Texto em negrito
    marginBottom: 10, // Espaço abaixo de cada linha
  },
  
  // Estilo para a área do display
  display: {
    height: 100, // Altura fixa de 100 unidades
    backgroundColor: '#f0f0f0', // Cor de fundo cinza claro
    justifyContent: 'flex-end', // Alinha conteúdo no final (baixo)
    alignItems: 'flex-end', // Alinha conteúdo à direita
    padding: 15, // Espaçamento interno
    marginBottom: 20, // Espaço abaixo do display
    borderRadius: 5, // Bordas arredondadas
  },
  
  // Estilo para a expressão histórica (acima do display principal)
  expressao: {
    fontSize: 18, // Tamanho menor que o display principal
    color: '#666', // Cor cinza médio
    marginBottom: 10, // Espaço entre expressão e display
  },
  
  // Estilo para o texto principal do display
  textoDisplay: {
    fontSize: 32, // Tamanho grande para boa visibilidade
    fontWeight: 'bold', // Texto em negrito
  },
  
  // Container dos botões (layout em linha)
  botoes: {
    flexDirection: 'row', // Disposição horizontal
    gap: 10, // Espaço de 10 unidades entre colunas
  },
  
  // Coluna dos números (esquerda)
  colunaNumeros: {
    flex: 3, // Ocupa 3 partes de 4 disponíveis (75% da largura)
    flexDirection: 'row', // Disposição horizontal
    flexWrap: 'wrap', // Permite quebra de linha
    gap: 10, // Espaço entre botões
  },
  
  // Coluna dos operadores (direita)
  colunaOperadores: {
    flex: 1, // Ocupa 1 parte de 4 disponíveis (25% da largura)
    gap: 10, // Espaço entre botões
  },
  
  // Estilo base para todos os botões
  botao: {
    height: 70, // Altura fixa para todos os botões
    backgroundColor: '#007AFF', // Cor azul padrão do iOS
    justifyContent: 'center', // Centraliza conteúdo verticalmente
    alignItems: 'center', // Centraliza conteúdo horizontalmente
    borderRadius: 5, // Bordas arredondadas
  },
  
  // Estilo específico para botões numéricos
  botaoNumero: {
    width: 70, // Largura fixa para botões numéricos
    backgroundColor: '#f0f0f0', // Cor cinza claro (diferente dos operadores)
  },
  
  // Estilo específico para botões de operação
  botaoOperador: {
    backgroundColor: '#FF9500', // Cor laranja (padrão calculadora iOS)
  },
  
  // Estilo específico para botão de igual
  botaoIgual: {
    backgroundColor: '#34C759', // Cor verde
  },
  
  // Estilo específico para botão Clear (C)
  botaoC: {
    width: 70, // Largura igual aos outros botões numéricos
    backgroundColor: '#FF3B30', // Cor vermelha
  },
  
  // Estilo específico para botão zero (mais largo)
  botaoZero: {
    width: 150, // Largura dupla (2 botões + gap)
  },
  
  // Estilo para o texto dentro dos botões
  textoBotao: {
    color: '#333', // Cor do texto (cinza escuro)
    fontSize: 20, // Tamanho da fonte
    fontWeight: 'bold', // Texto em negrito
  },
});

// Exporta o componente como padrão para ser usado em outros arquivos
export default App;