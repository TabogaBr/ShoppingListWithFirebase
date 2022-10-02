import { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TextInput, Button, FlatList } from 'react-native';
import { initializeApp } from 'firebase/app';
import { getDatabase, push, ref, onValue, remove } from 'firebase/database';

export default function App() {

  const firebaseConfig = {
    apiKey: "AIzaSyAuNa37ceCZyt2LH4bebVg-RKW1LewuPKA",
    authDomain: "shopping-list-1c72b.firebaseapp.com",
    projectId: "shopping-list-1c72b",
    storageBucket: "shopping-list-1c72b.appspot.com",
    messagingSenderId: "748849469706",
    appId: "1:748849469706:web:91d3b4e62f5d9b2d8b82f3",
    measurementId: "G-FH5HPE1D3H",
    databaseURL: "https://shopping-list-1c72b-default-rtdb.europe-west1.firebasedatabase.app/"
  };

  const app = initializeApp(firebaseConfig);
  const database = getDatabase(app);

  const [amount, setAmount] = useState('');
  const [product, setProduct] = useState('');
  const [items, setItems] = useState([]);
  const [keys, setKeys] = useState([]);

  useEffect(() => {
    const itemsRef = ref(database, 'items/');
    onValue(itemsRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const firebaseItems = Object.values(data);
        const firebaseKeys = Object.keys(data);
        setItems(firebaseItems);
        setKeys(firebaseKeys);
      } else {
        setItems([]);
      }
    })
  }, []);

  const saveItem = () => {
    push(
      ref(database, 'items/'),
      { 'product': product, 'amount': amount });
    setAmount('');
    setProduct('');
  }

  const deleteItem = (index) => {
    var key = keys[index];
    remove(ref(database, 'items/' + key));
  }

  return (
    <View style={styles.container}>
      <TextInput style={[styles.textinputs, styles.margins, styles.textTop]}
        placeholder="Product"
        onChangeText={product => setProduct(product)}
        value={product} />
      <TextInput style={[styles.textinputs, styles.margins]}
        placeholder="Amount"
        onChangeText={amount => setAmount(amount)}
        value={amount}
      />
      <Button onPress={saveItem} title=" SAVE " />
      <FlatList contentContainerStyle={styles.items}
        style={styles.list}
        data={items}
        renderItem={({ item, index }) =>
          <View style={styles.listcontainer}>
            <Text style={styles.item}>{item.product}, {item.amount} </Text>
            <Text style={[{ color: '#0000ff' }, styles.item]} onPress={() => deleteItem(index)}>delete</Text>
          </View>}
        ListHeaderComponent={<Text style={styles.title} > Shopping List </Text>}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  textinputs: {
    width: 200,
    borderColor: 'gray',
    borderWidth: 1,
  },
  margins: {
    margin: '3%',
  },
  list: {
    paddingVertical: '5%',
  },
  textTop: {
    marginTop: 100,
  },
  items: {
    alignItems: 'center',
  },
  title: {
    color: 'blue',
    fontSize: 18,
  },
  item: {
    fontSize: 16,
    margin: '2%',
  },
  listcontainer: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
});
