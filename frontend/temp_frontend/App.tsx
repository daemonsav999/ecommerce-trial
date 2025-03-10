import React from 'react';
import {SafeAreaView, StatusBar, Text, View} from 'react-native';

function App(): React.JSX.Element {
  return (
    <SafeAreaView style={{flex: 1}}>
      <StatusBar barStyle="dark-content" />
      <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
        <Text>Welcome to temp_frontend</Text>
      </View>
    </SafeAreaView>
  );
}

export default App;
