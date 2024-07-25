import React from 'react';
import { View, Button, Alert, PermissionsAndroid, Platform } from 'react-native';
import RNBlobUtil from 'react-native-blob-util';
import RNFS from 'react-native-fs';

const App = () => {
  const downloadPDF = async () => {
    try {
      const pdfUrl = 'https://ncert.nic.in/textbook/pdf/kech101.pdf';
      const downloads = RNFS.DownloadDirectoryPath;

      if (!downloads) {
        throw new Error('Downloads directory path is undefined');
      }

      console.log('Downloads directory:', downloads);

      const permissionGranted = await requestStoragePermission();
      // if (!permissionGranted) {
      //   Alert.alert('Permission Denied', 'You need to grant storage permission to download files.');
      //   return;
      // }

      RNBlobUtil.config({
        addAndroidDownloads: {
          useDownloadManager: true,
          notification: true,
          path: `${downloads}/your-pdf-file.pdf`,
          description: 'Downloading PDF',
        },
      })
        .fetch('GET', pdfUrl)
        .then((res) => {
          Alert.alert('Download Complete', 'File downloaded to: ' + res.path());
        })
        .catch((error) => {
          console.error(error);
          Alert.alert('Download Failed', 'An error occurred while downloading the file.');
        });
    } catch (error) {
      console.error('Error in downloadPDF:', error.message);
      Alert.alert('Error', error.message);
    }
  };

  const requestStoragePermission = async () => {
    if (Platform.OS === 'android') {
      try {
        const writeGranted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
          {
            title: 'Storage Permission Required',
            message: 'This app needs access to your storage to download files.',
          }
        );

        const readGranted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
          {
            title: 'Storage Permission Required',
            message: 'This app needs access to your storage to download files.',
          }
        );

        return writeGranted === PermissionsAndroid.RESULTS.GRANTED &&
               readGranted === PermissionsAndroid.RESULTS.GRANTED;
      } catch (err) {
        console.warn(err);
        return false;
      }
    } else {
      return true;
    }
  };

  return (
    <View>
      <Button title="Download PDF" onPress={downloadPDF} />
    </View>
  );
};

export default App;
