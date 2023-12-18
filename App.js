import React,{useEffect,useState} from 'react'
import { View, Text ,TouchableOpacity,TextInput,StyleSheet} from 'react-native'
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import SQLite from 'react-native-sqlite-storage';
const db=SQLite.openDatabase(
  {
    name:'Record',
    location:'default'
  },
  ()=>{console.log("Database connected Successfully")},
  (e)=>{console.log(e)}

)
const createTable=()=>{
  db.transaction(
    (tx)=>{
      tx.executeSql(
        "Create Table if not exists RECORDS (ID INTEGER PRIMARY KEY AUTOINCREMENT,NAME TEXT,AGE INTEGER,ADDRESS TEXT)",
        [],
        ()=>{console.log("Table Created Successfully")},
        (e)=>{console.log(e)}
      )
    }
  )
}
const insertRecord=()=>{
db.transaction(
  (tx)=>{
    tx.executeSql(
      "Insert into RECORDS (NAME,AGE,ADDRESS) values ('Sheri',22,'Lahore,Pakistan'),('Zain',25,'Sialkot,Pakistan'),"+
      "('Sara',24,'Muzafarabad,Pakistan'),('Fazeela',22,'Lahore,Pakistan'),('Qandeel',15,'Lahore,Pakistan'),"+
      "('Laiba',19,'Mansehra,Pakistan'),('Sami',18,'Abbottabad,Pakistan'),('Wasi',20,'Islamabad,Pakistan'),"+
      "('Mamoona',21,'Abbottabad,Pakistan'),('Shumaila',28,'Karachi,Pakistan')",
      [],
      ()=>{console.log("Data inserted")},
      (e)=>{console.log('error '+e)}
      )
  }
)
}
function SearchRecord({navigation}) {
  const[id,setId]=useState("")
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>

<View style={{flexDirection:'row'}}>
     <View style={{flexDirection:'column', alignItems:'center'}}>
      <Text style={styles.txt}>Enter ID:      </Text>
      </View>

      <View style={{flexDirection:'column'}}>
        <TextInput style={styles.txtIn} value={id} onChangeText={setId}></TextInput>
       <Text>{"\n"}</Text>
      <TouchableOpacity style={styles.btn} onPress={()=>{
        navigation.navigate('View Record',{'id':id})
        }}><Text style={styles.btntxt}>Search</Text></TouchableOpacity>
    </View> 
    </View> 
    </View>
  );
}
function ViewRecord({route}) {
  id=route.params?.id
  useEffect(
    ()=>{
    getData()
    },[]
  )
  const[record,setRecord]=useState({})
  const getData=()=>{
    db.transaction(
      (tx)=>{
        tx.executeSql(
          "Select * from RECORDS where ID=?",
          [id],
           (z,result)=>{
            var length=result.rows.length
            if(length==1){
              console.log(result.rows.item(0))
              setRecord(result.rows.item(0))
            }
          },
          (e)=>{console.log(e)}
        )
      }
    )
  }
    return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
    <View style={{flexDirection:'column', alignItems:'center'}}>
    <View style={{flexDirection:'row', alignItems:'center'}}>
      <Text style={styles.txt}>ID:                  </Text>
      <Text style={styles.txtIn}>{record.ID}</Text>
      </View>
      </View>

      <Text>{"\n"}</Text>
      <View style={{flexDirection:'column', alignItems:'center'}}>
    <View style={{flexDirection:'row', alignItems:'center'}}>
      <Text style={styles.txt}>NAME:            </Text>
      <Text style={styles.txtIn}>{record.NAME}</Text>
      </View>
      </View>

      <Text>{"\n"}</Text>
      <View style={{flexDirection:'column', alignItems:'center'}}>
    <View style={{flexDirection:'row', alignItems:'center'}}>
      <Text style={styles.txt}>AGE:               </Text>
      <Text style={styles.txtIn}>{record.AGE}</Text>
      </View>
      </View>  
    
      <Text>{"\n"}</Text>
      <View style={{flexDirection:'column'}}>
    <View style={{flexDirection:'row'}}>
      <Text style={styles.txt} >ADDRESS:      </Text>
      <Text style={styles.txtInAdd} >{record.ADDRESS}</Text>
      </View>
      </View>

    </View>
  );
}


const Stack = createNativeStackNavigator();
function App() {
  // useEffect(
  //   ()=>{
  // createTable()
  // insertRecord()
  //   },[]
  // )
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Search Record" component={SearchRecord} />
        <Stack.Screen name="View Record" component={ViewRecord} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default App;
const styles=StyleSheet.create(
  {
    txtIn:{
      width:150,
      height:40,
      backgroundColor:'#d9d9d9',
      borderRadius:4,
      color:'black',
      fontSize:18,
      padding:8
      
    },
    txtInAdd:{
      width:150,
      height:80,
      backgroundColor:'#d9d9d9',
      borderRadius:4,
      color:'black',
      fontSize:18,
      textAlignVertical: 'top',
      padding:8
    },
    btn:{
      width:150,
      height:40,
      borderRadius:7,
      backgroundColor:'#9ba0a8'
      
    },
    btntxt:{
      fontWeight:'bold',
      color:'black',
     margin:9,
      alignSelf:'center'
    },
    txt:{
      padding:7,
      fontWeight:'bold',
      fontSize:18
    }
  }
)
