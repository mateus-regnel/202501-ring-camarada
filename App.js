import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView } from 'react-native';

const App = () => {
  const [display, setDisplay] = useState('0');
  const [primeiroNumero, setPrimeiroNumero] = useState(null);
  const [operacao, setOperacao] = useState(null);
  const [aguardandoNumero, setAguardandoNumero] = useState(false);
  const [expressao, setExpressao] = useState('');

  const lidarComNumero = (num) => {
    if (display === '0' || aguardandoNumero) {
      setDisplay(num);
      setAguardandoNumero(false);
    } else {
      setDisplay(display + num);
    }
  };

  const lidarComOperacao = (op) => {
    if (primeiroNumero === null) {
      setPrimeiroNumero(parseFloat(display.replace(',', '.')));
      setExpressao(display + ' ' + op + ' ');
      setDisplay('0');
    } else if (!aguardandoNumero) {
      const resultado = calcular();
      setPrimeiroNumero(resultado);
      setExpressao(String(resultado).replace('.', ',') + ' ' + op + ' ');
      setDisplay('0');
    } else {
      setExpressao(expressao.slice(0, -2) + op + ' ');
    }
    
    setOperacao(op);
    setAguardandoNumero(true);
  };

  const calcular = () => {
    const segundoNumero = parseFloat(display.replace(',', '.'));
    
    switch (operacao) {
      case '+': return primeiroNumero + segundoNumero;
      case '-': return primeiroNumero - segundoNumero;
      case '*': return primeiroNumero * segundoNumero;
      case '/': return primeiroNumero / segundoNumero;
      default: return segundoNumero;
    }
  };

  const igual = () => {
    if (primeiroNumero !== null && operacao !== null && !aguardandoNumero) {
      const resultado = calcular();
      const expressaoCompleta = expressao + display + ' = ' + String(resultado).replace('.', ',');
      setDisplay(String(resultado).replace('.', ','));
      setExpressao(expressaoCompleta);
      setPrimeiroNumero(null);
      setOperacao(null);
      setAguardandoNumero(true);
    }
  };

  const limpar = () => {
    setDisplay('0');
    setPrimeiroNumero(null);
    setOperacao(null);
    setAguardandoNumero(false);
    setExpressao('');
  };

  const virgula = () => {
    if (aguardandoNumero) {
      setDisplay('0,');
      setAguardandoNumero(false);
    } else if (display.indexOf(',') === -1) {
      setDisplay(display + ',');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.cabecalho}>Nome: Mateus Martins de Castro Regnel</Text>
      <Text style={styles.cabecalho}>RA: 2023103773</Text>

      <View style={styles.display}>
        <Text style={styles.expressao}>{expressao}</Text>
        <Text style={styles.textoDisplay}>{display}</Text>
      </View>

      <View style={styles.botoes}>
        <View style={styles.colunaNumeros}>
          <TouchableOpacity style={[styles.botao, styles.botaoC]} onPress={limpar}>
            <Text style={styles.textoBotao}>C</Text>
          </TouchableOpacity>

          {['7', '8', '9', '4', '5', '6', '1', '2', '3', '0', ','].map((item) => (
            <TouchableOpacity 
              key={item}
              style={[
                styles.botao, 
                styles.botaoNumero,
                item === '0' && styles.botaoZero
              ]} 
              onPress={() => item === ',' ? virgula() : lidarComNumero(item)}
            >
              <Text style={styles.textoBotao}>{item}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.colunaOperadores}>
          {['/', '*', '-', '+', '='].map((item) => (
            <TouchableOpacity 
              key={item}
              style={[
                styles.botao, 
                styles.botaoOperador,
                item === '=' && styles.botaoIgual
              ]} 
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    paddingTop: 60,
    backgroundColor: '#fff',
  },
  cabecalho: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  display: {
    height: 100,
    backgroundColor: '#f0f0f0',
    justifyContent: 'flex-end',
    alignItems: 'flex-end',
    padding: 15,
    marginBottom: 20,
    borderRadius: 5,
  },
  expressao: {
    fontSize: 18,
    color: '#666',
    marginBottom: 10,
  },
  textoDisplay: {
    fontSize: 32,
    fontWeight: 'bold',
  },
  botoes: {
    flexDirection: 'row',
    gap: 10,
  },
  colunaNumeros: {
    flex: 3,
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  colunaOperadores: {
    flex: 1,
    gap: 10,
  },
  botao: {
    height: 70,
    backgroundColor: '#007AFF',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 5,
  },
  botaoNumero: {
    width: 70,
    backgroundColor: '#f0f0f0',
  },
  botaoOperador: {
    backgroundColor: '#FF9500',
  },
  botaoIgual: {
    backgroundColor: '#34C759',
  },
  botaoC: {
    width: 70,
    backgroundColor: '#FF3B30',
  },
  botaoZero: {
    width: 150,
  },
  textoBotao: {
    color: '#333',
    fontSize: 20,
    fontWeight: 'bold',
  },
});

export default App;