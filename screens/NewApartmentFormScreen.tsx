import { useMutation } from "@apollo/client";
import React, { useEffect, useState } from "react";
import {
  Button,
  StyleSheet,
  View,
  Image,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { TextInput } from "react-native-gesture-handler";
import Colors from "../constants/Colors";
import { ADD_APARTMENT } from "../graphQL/Mutations";
import { useStore } from "../hooks/StoreContext";
import * as ImagePicker from "expo-image-picker";
import { Platform } from "react-native";
import { ReactNativeFile } from "apollo-upload-client";
import ImageView from "react-native-image-viewing";

const NewApartmentFormScreen = ({ navigation }: any) => {
  const store = useStore();
  const [title, setTitle] = useState<string>("");
  const [details, setDetails] = useState<string>("");
  const [address, setAddress] = useState<string>("");
  const [city, setCity] = useState<string>("");
  const [price, setPrice] = useState<number>();
  const [type, setType] = useState("");
  const [msquare, setMsquare] = useState<number>();
  const [roomCount, setRoomCount] = useState<number>();
  // const [geoLocation, setGeolocation] = useState<number[]>([]);
  const geolocation = [41.99646, 21.43141];

  const [images, setImages] = useState<string[]>([]);
  const [uploading, setUploading] = useState(false);

  const [isFullScreen, setIsFullScreen] = useState(false);
  const [fullScreenPhotoIndex, setFullScreenPhotoIndex] = useState(0);

  useEffect(() => {
    (async () => {
      if (Platform.OS !== "web") {
        const {
          status,
        } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== "granted") {
          alert("Sorry, we need camera roll permissions to make this work!");
        }
      }
    })();
  }, []);

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 1,
    });

    if (!result.cancelled) {
      setImages([...images, result.uri]);
    }
  };

  const [
    addApartment,
    { data: newApartment, loading: loadingNewApartment },
  ] = useMutation(ADD_APARTMENT);

  useEffect(() => {
    if (newApartment) {
      store.addApartment(newApartment.addApartment);
      navigation.pop();
    }
    if (loadingNewApartment) {
      setUploading(true);
    }
  }, [newApartment, loadingNewApartment]);

  function generateRNFile(uri: string, name: string) {
    return uri
      ? new ReactNativeFile({
          uri,
          type: "image/jpeg",
          name,
        })
      : null;
  }

  const handleSubmit = () => {
    //there is a bug in api for upload files.

    // const photos: any = [];
    // images.forEach((photo, i) => {
    //   photos.push(generateRNFile(photo, `picture-${Date.now()}-${i + 1}`));
    // });

    addApartment({
      variables: {
        title,
        details,
        date: `${+new Date()}`,
        geolocation,
        address,
        city,
        price,
        type,
        // photos,
        msquare,
        roomCount,
      },
    });
  };
  return (
    <View style={styles.container}>
      <ScrollView>
        <View
          style={{
            marginVertical: 30,
            height: 130,
            marginHorizontal: 10,
            alignSelf: "center",
          }}
        >
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {images.map((photo, index) => (
              <View style={{ marginRight: 10 }} key={photo}>
                <TouchableOpacity
                  onPress={() => {
                    setFullScreenPhotoIndex(index);
                    setIsFullScreen(true);
                  }}
                >
                  <Image
                    style={{
                      height: 130,
                      width: 130,
                      borderRadius: 10,
                      resizeMode: "cover",
                    }}
                    source={{
                      uri: photo,
                    }}
                  />
                </TouchableOpacity>
              </View>
            ))}
          </ScrollView>
          <ImageView
            images={images.map((img) => {
              return {
                uri: img,
              };
            })}
            imageIndex={fullScreenPhotoIndex}
            visible={isFullScreen}
            swipeToCloseEnabled={false}
            onRequestClose={() => setIsFullScreen(false)}
          />
        </View>
        <View style={{ marginBottom: 20 }}>
          <Button
            title={images.length < 1 ? "Add Photo *" : "Add More Photos"}
            disabled={uploading || images.length > 4}
            color={Colors.primary}
            onPress={pickImage}
          />
        </View>
        <TextInput
          style={styles.input}
          value={title}
          placeholder="Title *"
          onChangeText={(value) => setTitle(value)}
        />
        <TextInput
          style={styles.input}
          value={details}
          placeholder="Details *"
          onChangeText={(value) => setDetails(value)}
        />
        <TextInput
          style={styles.input}
          value={type}
          placeholder="Type *"
          onChangeText={(value) => setType(value)}
        />
        <TextInput
          style={styles.input}
          value={address}
          placeholder="Address *"
          onChangeText={(value) => setAddress(value)}
        />
        <TextInput
          style={styles.input}
          value={city}
          placeholder="City *"
          onChangeText={(value) => setCity(value)}
        />
        <TextInput
          style={styles.input}
          value={price?.toString()}
          placeholder="Price *"
          onChangeText={(value) => setPrice(+value)}
          keyboardType="numeric"
        />
        <TextInput
          style={styles.input}
          value={msquare?.toString()}
          placeholder="Meter Sqaure *"
          onChangeText={(value) => setMsquare(+value)}
          keyboardType="numeric"
        />
        <TextInput
          style={styles.input}
          value={roomCount?.toString()}
          placeholder="Rooms Count *"
          onChangeText={(value) => setRoomCount(+value)}
          keyboardType="numeric"
        />
      </ScrollView>
      <View style={{ marginTop: 20 }}>
        <Button
          color={Colors.primary}
          title="Submit"
          onPress={handleSubmit}
          disabled={
            uploading ||
            !title ||
            !details ||
            !address ||
            !price ||
            !type ||
            !msquare ||
            !roomCount ||
            !title
          }
        />
      </View>
    </View>
  );
};

export default NewApartmentFormScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  input: {
    padding: 10,
    borderColor: Colors.black,
    borderWidth: 1,
    marginBottom: 10,
    color: Colors.black,
    fontSize: 18,
  },
});
