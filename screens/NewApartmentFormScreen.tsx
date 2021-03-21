import { useMutation } from "@apollo/client";
import React, { useEffect, useState } from "react";
import {
  Button,
  StyleSheet,
  View,
  Image,
  ScrollView,
  TouchableOpacity,
  Linking,
  Alert,
  Text,
} from "react-native";
import { TextInput } from "react-native-gesture-handler";
import Colors from "../constants/Colors";
import { ADD_APARTMENT } from "../graphQL/Mutations";
import { useStore } from "../hooks/StoreContext";
import * as ImagePicker from "expo-image-picker";
import { ReactNativeFile } from "apollo-upload-client";
import ImageView from "react-native-image-viewing";
import * as Location from "expo-location";
import { Ionicons } from "@expo/vector-icons";
import { AdType, BuildingType, CityType } from "../interfaces";
import RNPickerSelect from "react-native-picker-select";
import { buildingTypes, adTypes, cityTypes } from "../constants/Selectable";
import * as ImageManipulator from "expo-image-manipulator";
import LoadingSpinner from "../components/LoadingSpinner";

const NewApartmentFormScreen = ({ navigation }: any) => {
  const store = useStore();
  const [title, setTitle] = useState<string>("");
  const [details, setDetails] = useState<string>("");
  const [address, setAddress] = useState<string>("");
  const [price, setPrice] = useState<number>();
  const [city, setCity] = useState<CityType>(CityType.SKOPJE);
  const [buildingType, setBuildingType] = useState<BuildingType>(
    BuildingType.FLAT
  );
  const [adType, setAdType] = useState<AdType>(AdType.RENT);
  const [floor, setFloor] = useState<number>();

  const [msquare, setMsquare] = useState<number>();
  const [roomCount, setRoomCount] = useState<number>();
  const [geolocation, setGeolocation] = useState<number[]>([0, 0]);

  const [images, setImages] = useState<string[]>([]);
  const [uploading, setUploading] = useState(false);

  const [isFullScreen, setIsFullScreen] = useState(false);
  const [fullScreenPhotoIndex, setFullScreenPhotoIndex] = useState(0);

  const pickImage = async () => {
    const {
      status: statusImagePicker,
    } = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (statusImagePicker !== "granted") {
      alert("Sorry, we need camera roll permissions to make this work!");
      return;
    }

    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.5,
    });

    if (result.cancelled) {
      return;
    }

    const RESIZE_RATIO = result.width > 800 ? 800 / result.width : 1;

    const manipResult = await ImageManipulator.manipulateAsync(result.uri, [
      {
        resize: {
          width: result.width * RESIZE_RATIO,
          height: result.height * RESIZE_RATIO,
        },
      },
    ]);
    setImages([...images, manipResult.uri]);
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
    const photos: any = [];
    images.forEach((photo, i) => {
      photos.push(generateRNFile(photo, `picture-${Date.now()}-${i + 1}`));
    });

    addApartment({
      variables: {
        title,
        details,
        date: `${+new Date()}`,
        geolocation,
        address,
        city,
        price,
        buildingType,
        adType,
        photos,
        msquare,
        roomCount,
        floor,
      },
    });
  };

  const attemptGeocodeAsync = async () => {
    const { status: statusLocation } = await Location.requestPermissionsAsync();

    if (statusLocation !== "granted") {
      alert("Sorry, we need location to find geocoding of the address!");
      return;
    }

    try {
      const result = await Location.geocodeAsync(address);
      const { latitude, longitude } = result[0];
      setGeolocation([latitude, longitude]);
    } catch (e) {
      Alert.alert("Location error", "Please enter a valid address");
    }
  };

  return (
    <View style={styles.container}>
      {loadingNewApartment ? <LoadingSpinner /> : null}
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
                  style={{
                    position: "absolute",
                    top: -5,
                    right: -5,
                    zIndex: 1,
                    backgroundColor: Colors.white,
                    borderRadius: 50,
                    padding: 5,
                  }}
                  onPress={() =>
                    setImages([
                      ...images.slice(0, index),
                      ...images.slice(index + 1),
                    ])
                  }
                >
                  <Ionicons name="remove-circle" size={25} color="#f00" />
                </TouchableOpacity>
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
        <View>
          <RNPickerSelect
            placeholder={{}}
            value={buildingType}
            onValueChange={(itemValue) => {
              setBuildingType(itemValue);
            }}
            itemKey="value"
            items={buildingTypes}
          />
        </View>
        <View>
          <RNPickerSelect
            placeholder={{}}
            value={adType}
            onValueChange={(itemValue) => {
              setAdType(itemValue);
            }}
            itemKey="value"
            items={adTypes}
          />
        </View>
        <View>
          <RNPickerSelect
            placeholder={{}}
            value={city}
            onValueChange={(itemValue) => {
              setCity(itemValue);
            }}
            itemKey="value"
            items={cityTypes}
          />
        </View>
        <TextInput
          style={styles.input}
          value={title}
          placeholder="Title *"
          placeholderTextColor={Colors.gray}
          onChangeText={(value) => setTitle(value)}
        />
        <TextInput
          style={styles.input}
          value={details}
          placeholder="Details *"
          placeholderTextColor={Colors.gray}
          onChangeText={(value) => setDetails(value)}
        />
        <TextInput
          style={styles.input}
          value={price?.toString() || ""}
          placeholder="Price (euro) *"
          placeholderTextColor={Colors.gray}
          onChangeText={(value) => {
            if (parseInt(value)) {
              setPrice(parseInt(value));
            } else {
              setPrice(undefined);
            }
          }}
          keyboardType="numeric"
          returnKeyType="done"
        />
        <TextInput
          style={styles.input}
          value={msquare?.toString() || ""}
          placeholder="Meter Sqaure *"
          placeholderTextColor={Colors.gray}
          onChangeText={(value) => {
            if (parseInt(value)) {
              setMsquare(parseInt(value));
            } else {
              setMsquare(undefined);
            }
          }}
          keyboardType="numeric"
          returnKeyType="done"
        />
        <TextInput
          style={styles.input}
          value={roomCount?.toString() || ""}
          placeholder="Room Count *"
          placeholderTextColor={Colors.gray}
          onChangeText={(value) => {
            if (parseInt(value)) {
              setRoomCount(parseInt(value));
            } else {
              setRoomCount(undefined);
            }
          }}
          keyboardType="numeric"
          returnKeyType="done"
        />
        <TextInput
          style={styles.input}
          value={floor?.toString() || ""}
          placeholder="Floor *"
          placeholderTextColor={Colors.gray}
          onChangeText={(value) => {
            if (parseInt(value)) {
              setFloor(parseInt(value));
            } else {
              setFloor(undefined);
            }
          }}
          keyboardType="numeric"
          returnKeyType="done"
        />
        <TextInput
          style={styles.input}
          value={address}
          placeholder="Address *"
          placeholderTextColor={Colors.gray}
          onChangeText={(value) => setAddress(value)}
        />
        <View style={{ marginVertical: 20 }}>
          <Button
            title="Find geolocation based on address"
            disabled={!address}
            onPress={() => attemptGeocodeAsync()}
          />
        </View>
        <Text style={styles.input}>
          {geolocation[0] !== 0 ? geolocation[0].toString() : "Latitude *"}
        </Text>
        <Text style={styles.input}>
          {geolocation[1] !== 0 ? geolocation[1].toString() : "Longitude *"}
        </Text>

        <View style={{ marginVertical: 20 }}>
          <Button
            title="See Address in Maps"
            disabled={geolocation[0] == 1 || geolocation[1] == 0}
            onPress={() =>
              Linking.openURL(
                `http://maps.google.com/maps?z=18&q=${geolocation[0]},${geolocation[1]}`
              )
            }
          />
        </View>
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
            !msquare ||
            !roomCount ||
            !floor ||
            geolocation[0] == 0 ||
            geolocation[1] == 0 ||
            images.length < 1
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
