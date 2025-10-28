import React, { useState } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  FlatList, 
  StyleSheet,
  SafeAreaView 
} from 'react-native';

const App = () => {
  const [texto, setTexto] = useState('');
  const [itens, setItens] = useState([]);

  const inserirItem = () => {
    if (texto.trim() !== '') {
      setItens([...itens, texto]);
      setTexto('');
    }
  };

  const limparLista = () => {
    setItens([]);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.conteudo}>
        <Text style={styles.header}>Nome: Mateus Martins de Castro Regnel</Text>
        <Text style={styles.header}>RA: 2023103773</Text>

        <TextInput
          style={styles.input}
          placeholder="Digite um texto..."
          value={texto}
          onChangeText={setTexto}
        />
        
        <View style={styles.botoes}>
          <TouchableOpacity style={styles.botao} onPress={inserirItem}>
            <Text style={styles.textoBotao}>Inserir</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={[styles.botao, styles.botaoLimpar]} onPress={limparLista}>
            <Text style={styles.textoBotao}>Limpar</Text>
          </TouchableOpacity>
        </View>

        <FlatList
          data={itens}
          renderItem={({ item, index }) => (
            <View style={styles.itemContainer}>
              <Text style={styles.item}>
                {index + 1}. {item}
              </Text>
            </View>
          )}
          keyExtractor={(item, index) => index.toString()}
          style={styles.lista}
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    marginTop: 40
  },
  conteudo: {
    flex: 1,
    padding: 20,
    paddingTop: 20,
  },
  header: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 12,
    marginBottom: 15,
    fontSize: 16,
  },
  botoes: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
    gap: 10,
  },
  botao: {
    backgroundColor: '#007AFF',
    padding: 15,
    borderRadius: 5,
    flex: 1,
    alignItems: 'center',
  },
  botaoLimpar: {
    backgroundColor: '#FF3B30',
  },
  textoBotao: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  lista: {
    flex: 1,
  },
  itemContainer: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  item: {
    fontSize: 16,
    color: '#333',
  },
});

export default App;