import React, { useEffect, useState } from 'react'
import {View,TouchableOpacity,Text, FlatList} from 'react-native'
import { TextInput } from 'react-native-paper';
import SQLite from 'react-native-sqlite-storage'
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
const db=SQLite.openDatabase(
  {
    name:'Record',
    location:'default',
  },
  ()=>{console.log("Database Connected")},
  error=>{console.log(error)}
);

const createTable=()=>{
  db.transaction(
    (tx)=>{
    tx.executeSql(
      "CREATE TABLE IF NOT EXISTS USERS (ID INTEGER PRIMARY KEY AUTOINCREMENT,NAME TEXT,AGE INTEGER,ADDRESS TEXT)",
      [],
      ()=>{console.log("User Table Created")},
      (error)=>{console.log(error)}
    )
  })
}

 
function HomeScreen({navigation}) {
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <TouchableOpacity onPress={()=>createTable()}><Text>Create Table</Text></TouchableOpacity>
<TouchableOpacity onPress={()=>navigation.navigate('Insert')}><Text>Insert Data</Text></TouchableOpacity>
<TouchableOpacity onPress={()=>navigation.navigate('Update')}><Text>Update Data</Text></TouchableOpacity>
<TouchableOpacity onPress={()=>navigation.navigate('View')}><Text>View Data</Text></TouchableOpacity>
<TouchableOpacity onPress={()=>navigation.navigate('Delete')}><Text>Delete Data</Text></TouchableOpacity>
    </View>
  );
}
function ViewData() {
  const[record,setRecord]=useState([])
  useEffect(()=>{
seeData()
  },[])
  const seeData=()=>{
    db.transaction(
      (tx)=>{
        tx.executeSql(
          "SELECT * FROM USERS",
          [],
          (z,results)=>{
           var length=results.rows.length
           var data=[]
            if(length>0){
              for(let i=0;i<length;i++){
                data.push(results.rows.item(i))
              }
              setRecord(data)
            }
          },
          (error)=>{console.log(error)}
        )
      }
    )
  }
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <FlatList data={record}
      renderItem={({item})=>(<Text>{item.NAME}           {item.AGE}           {item.ADDRESS}</Text>)}/>
    </View>
  );
}

function InsertData() {
  const[name,setName]=useState("")
  const[age,setAge]=useState("")
  const[address,setAddress]=useState("")
  const setData=()=>{
    db.transaction(
     (tx)=>{
       tx.executeSql(
         "INSERT INTO USERS (NAME,AGE,ADDRESS) VALUES (?,?,?)",
         [name,age,address],
         ()=>{console.log("Record Inserted Successfully")},
         (error)=>{console.log(error)}
       )
     }
   )
 }
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
     <TextInput
      label="Name" value={name} onChangeText={setName}/>
      <Text>{"\n"}</Text>
      <TextInput label="Age" value={age} onChangeText={setAge}/>
      <Text>{"\n"}</Text>
      <TextInput label="Address"  value={address} onChangeText={setAddress}/>
      <Text>{"\n"}</Text>
      <TouchableOpacity onPress={()=>{setData()}}><Text>Insert Data</Text></TouchableOpacity>
    </View>
  );
}

function UpdateData() {
  const[id,setId]=useState("")
  const[name,setName]=useState("")
const changeData=()=> {
   db.transaction(
    (tx)=>{
      tx.executeSql(
        "UPDATE USERS SET NAME=? WHERE ID=?",
        [name,id],
        ()=>{console.log("Updated Sucessfully")},
        (error)=>{console.log(error)}
      )
    }
   )
  }
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <TextInput
      label="id" value={id} onChangeText={setId}/>
      <Text>{"\n"}</Text>
      <TextInput
      label="Name" value={name} onChangeText={setName}/>
      <Text>{"\n"}</Text>
<TouchableOpacity onPress={()=>changeData()}><Text>Update Data</Text></TouchableOpacity>
    </View>
  );
}
function DeleteData(){
  const[id,setId]=useState("")
function del(){
  db.transaction(
    (tx)=>{
      tx.executeSql(
        "DELETE FROM USERS WHERE ID=?",
        [id],
        ()=>{console.log("Deleted Sucessfully")},
        (error)=>{console.log(error)}
      )
    }
  )
}
  return(
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
    <TextInput
    label="id" value={id} onChangeText={setId}/>
    <Text>{"\n"}</Text>
<TouchableOpacity onPress={()=>del()}><Text>Delete Data</Text></TouchableOpacity>
  </View>
  )
}
const Stack = createNativeStackNavigator();
function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Insert" component={InsertData} />
        <Stack.Screen name="Update" component={UpdateData} />
        <Stack.Screen name="View" component={ViewData} />
        <Stack.Screen name="Delete" component={DeleteData} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default App;

