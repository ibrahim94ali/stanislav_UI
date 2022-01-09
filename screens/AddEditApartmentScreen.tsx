import { gql, useMutation } from "@apollo/client";
import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  View,
  Image,
  ScrollView,
  TouchableOpacity,
  Alert,
  Text,
} from "react-native";
import { TextInput } from "react-native-gesture-handler";
import Colors from "../constants/Colors";
import { ADD_APARTMENT, UPDATE_APARTMENT } from "../graphQL/Mutations";
import * as ImagePicker from "expo-image-picker";
import { ReactNativeFile } from "apollo-upload-client";
import ImageView from "react-native-image-viewing";
import * as Location from "expo-location";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { AdType, ApartmentI, BuildingType, CityType } from "../interfaces";
import {
  buildingTypes,
  adTypes,
  cityTypes,
  furnishingTypes,
} from "../constants/Selectable";
import * as ImageManipulator from "expo-image-manipulator";
import LoadingSpinner from "../components/LoadingSpinner";
import { dpx } from "../constants/Spacings";
import Button from "../components/Button";
import Header from "../components/Header";
import IconButton from "../components/IconButton";
import { SafeAreaView } from "react-native-safe-area-context";
import LocationPicker from "../components/LocationPicker";
import FilterOptions from "../components/FilterOptions";
import RNPickerSelect from "react-native-picker-select";
import { pickerSelectStyles } from "../constants/PickerStyle";
import { useTranslation } from "react-i18next";

const AddEditApartmentScreen = ({ navigation, route }: any) => {
  const { t } = useTranslation();
  const itemOnEdit: ApartmentI = route.params?.itemOnEdit || null;
  const [title, setTitle] = useState<string>(
    itemOnEdit ? itemOnEdit.title : ""
  );
  const [details, setDetails] = useState<string>(
    itemOnEdit ? itemOnEdit.details : ""
  );
  const [address, setAddress] = useState<string>(
    itemOnEdit ? itemOnEdit.address : ""
  );
  const [price, setPrice] = useState(itemOnEdit ? itemOnEdit.price : undefined);
  const [city, setCity] = useState<string>(
    itemOnEdit ? itemOnEdit.city : CityType.SKOPJE
  );
  const [buildingType, setBuildingType] = useState<BuildingType>(
    itemOnEdit ? itemOnEdit.buildingType : BuildingType.FLAT
  );
  const [adType, setAdType] = useState<AdType>(
    itemOnEdit ? itemOnEdit.adType : AdType.RENT
  );
  const [isFurnished, setIsFurnished] = useState<boolean>(
    itemOnEdit ? itemOnEdit.isFurnished : true
  );
  const [floor, setFloor] = useState(itemOnEdit ? itemOnEdit.floor : undefined);

  const [msquare, setMsquare] = useState(
    itemOnEdit ? itemOnEdit.msquare : undefined
  );
  const [roomCount, setRoomCount] = useState(
    itemOnEdit ? itemOnEdit.roomCount : undefined
  );
  const [geolocation, setGeolocation] = useState<number[]>(
    itemOnEdit ? itemOnEdit.geolocation : [0, 0]
  );

  const [uploadImages, setUploadImages] = useState<string[]>([]);

  const [oldImages, setOldImages] = useState<string[]>(
    itemOnEdit ? itemOnEdit.photos : []
  );

  const [isFullScreen, setIsFullScreen] = useState(false);
  const [fullScreenPhotoIndex, setFullScreenPhotoIndex] = useState(0);

  const pickImage = async () => {
    const { status: statusImagePicker } =
      await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (statusImagePicker !== "granted") {
      Alert.alert(t("PERMISSIONS.CAMERA_ROLL"));
      return;
    }

    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.3,
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
    setUploadImages([...uploadImages, manipResult.uri]);
  };

  const [addApartment, { data: newApartment, loading: loadingNewApartment }] =
    useMutation(ADD_APARTMENT, {
      update(cache, { data }) {
        if (data) {
          cache.reset();
        }
      },
    });

  const [
    updateApartment,
    { data: updatedApartment, loading: loadingUpatedApartment },
  ] = useMutation(UPDATE_APARTMENT, {
    update(cache, { data }) {
      const myUpdatedApartment: ApartmentI = data?.updateApartment;

      if (!myUpdatedApartment) return;

      cache.writeFragment({
        id: `Apartment:${myUpdatedApartment.id}`,
        fragment: gql`
          fragment id on Apartment {
            id
          }
        `,
        data: {
          ...myUpdatedApartment,
        },
      });
    },
  });

  useEffect(() => {
    if (newApartment) {
      navigation.pop();
    }
  }, [newApartment]);

  useEffect(() => {
    if (updatedApartment) {
      navigation.pop();
      navigation.pop();
    }
  }, [updatedApartment]);

  //setting user location as default location
  useEffect(() => {
    (async () => {
      if (itemOnEdit) return;
      let { status } = await Location.requestBackgroundPermissionsAsync();
      if (status !== "granted") {
        Alert.alert(t("PERMISSIONS.ADDRESS"));
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      if (location?.coords) {
        setGeolocation([location.coords.latitude, location.coords.longitude]);
      }
    })();
  }, []);

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
    uploadImages.forEach((photo, i) => {
      photos.push(generateRNFile(photo, `picture-${Date.now()}-${i + 1}`));
    });

    if (itemOnEdit) {
      updateApartment({
        variables: {
          id: itemOnEdit.id,
          title,
          details,
          date: `${+new Date()}`,
          geolocation,
          address,
          city,
          price,
          buildingType,
          adType,
          oldPhotosLinks: oldImages,
          newPhotos: photos,
          msquare,
          roomCount,
          floor,
          isFurnished,
        },
      });
      return;
    }

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
        isFurnished,
      },
    });
  };

  const attemptGeocodeAsync = async () => {
    const { status: statusLocation } =
      await Location.requestBackgroundPermissionsAsync();

    if (statusLocation !== "granted") {
      Alert.alert(t("PERMISSIONS.ADDRESS"));
      return;
    }

    try {
      const result = await Location.geocodeAsync(address);
      const { latitude, longitude } = result[0];
      setGeolocation([latitude, longitude]);
    } catch (e) {
      Alert.alert(
        t("PERMISSIONS.LOCATION_ERROR"),
        t("PERMISSIONS.ENTER_VALID_ADDRESS")
      );
    }
  };

  const NoImage = () => (
    <TouchableOpacity style={styles.noImageContainer} onPress={pickImage}>
      <MaterialIcons
        name="add-photo-alternate"
        size={dpx(60)}
        color={Colors.lightGray}
      />
    </TouchableOpacity>
  );

  const PhotoViewer = ({ photo, index, handlePress }: any) => (
    <View style={{ marginRight: 10 }}>
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
        onPress={() => handlePress()}
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
  );

  return (
    <SafeAreaView edges={["top"]} style={styles.container}>
      {(loadingNewApartment || loadingUpatedApartment) && <LoadingSpinner />}
      <Header>
        <IconButton handlePress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" color={Colors.black} size={dpx(24)} />
        </IconButton>
        <Text style={styles.header}>
          {itemOnEdit ? t("ADD_EDIT_APT.EDIT") : t("ADD_EDIT_APT.ADD")}
        </Text>
        <IconButton
          handlePress={pickImage}
          disabled={uploadImages.length + oldImages.length > 4}
        >
          <MaterialIcons
            name="add-photo-alternate"
            size={dpx(24)}
            color={
              uploadImages.length + oldImages.length > 4
                ? Colors.lightGray
                : Colors.primary
            }
          />
        </IconButton>
      </Header>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.imagesContainer}>
          {oldImages.length + uploadImages.length < 1 && <NoImage />}
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{
              paddingHorizontal: dpx(20),
            }}
          >
            {oldImages.map((photo, index) => (
              <PhotoViewer
                key={photo}
                photo={photo}
                index={index}
                handlePress={() =>
                  setOldImages([
                    ...oldImages.slice(0, index),
                    ...oldImages.slice(index + 1),
                  ])
                }
              />
            ))}
            {uploadImages.map((photo, index) => (
              <PhotoViewer
                key={photo}
                photo={photo}
                index={index}
                handlePress={() =>
                  setUploadImages([
                    ...uploadImages.slice(0, index),
                    ...uploadImages.slice(index + 1),
                  ])
                }
              />
            ))}
          </ScrollView>
          <ImageView
            images={
              itemOnEdit
                ? oldImages.concat(uploadImages).map((img) => ({
                    uri: img,
                  }))
                : uploadImages.map((img) => ({
                    uri: img,
                  }))
            }
            imageIndex={fullScreenPhotoIndex}
            visible={isFullScreen}
            swipeToCloseEnabled={false}
            onRequestClose={() => setIsFullScreen(false)}
          />
        </View>

        <TextInput
          style={styles.input}
          value={title}
          placeholder={t("ADD_EDIT_APT.FIELDS.TITLE") + " *"}
          placeholderTextColor={Colors.gray}
          onChangeText={(value) => setTitle(value)}
        />
        <TextInput
          style={styles.input}
          value={details}
          placeholder={t("ADD_EDIT_APT.FIELDS.DESCRIPTION") + " *"}
          placeholderTextColor={Colors.gray}
          onChangeText={(value) => setDetails(value)}
        />
        <TextInput
          style={styles.input}
          value={price?.toString() || ""}
          placeholder={t("ADD_EDIT_APT.FIELDS.PRICE") + " (euro) *"}
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
          placeholder={t("ADD_EDIT_APT.FIELDS.AREA") + " (ms2) *"}
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
          placeholder={t("ADD_EDIT_APT.FIELDS.ROOMS") + " *"}
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
          placeholder={t("ADD_EDIT_APT.FIELDS.FLOOR") + " *"}
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
          placeholder={t("ADD_EDIT_APT.FIELDS.ADDRESS") + " *"}
          placeholderTextColor={Colors.gray}
          onChangeText={(value) => setAddress(value)}
          onEndEditing={attemptGeocodeAsync}
        />

        <LocationPicker
          addressGeoCode={geolocation}
          onSave={(lat: number, lon: number) => setGeolocation([lat, lon])}
        />

        <View style={styles.cityContainer}>
          <RNPickerSelect
            placeholder={{}}
            value={city}
            onValueChange={(itemValue: CityType) => {
              setCity(itemValue);
            }}
            items={cityTypes}
            style={pickerSelectStyles}
          />
        </View>

        <View style={styles.optionContainer}>
          <FilterOptions
            title={t("ADD_EDIT_APT.PROPERTY_TYPE")}
            items={buildingTypes}
            value={buildingType}
            onValueChange={(itemValue: BuildingType) => {
              setBuildingType(itemValue);
            }}
          />
        </View>
        <View style={styles.optionContainer}>
          <FilterOptions
            title={t("ADD_EDIT_APT.AD_TYPE")}
            items={adTypes}
            value={adType}
            onValueChange={(itemValue: AdType) => {
              setAdType(itemValue);
            }}
          />
        </View>
        <View style={[styles.optionContainer, { marginBottom: dpx(30) }]}>
          <FilterOptions
            title={t("ADD_EDIT_APT.FURNISHING")}
            items={furnishingTypes}
            value={isFurnished}
            onValueChange={(itemValue: boolean) => {
              setIsFurnished(itemValue);
            }}
          />
        </View>
        <Button
          color={Colors.primary}
          title={t("ADD_EDIT_APT.SUBMIT")}
          onPress={handleSubmit}
          full
          disabled={
            !title ||
            !details ||
            !address ||
            !price ||
            !msquare ||
            !roomCount ||
            !floor ||
            geolocation[0] == 0 ||
            geolocation[1] == 0 ||
            uploadImages.length + oldImages.length < 1
          }
        />
      </ScrollView>
    </SafeAreaView>
  );
};

export default AddEditApartmentScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    fontFamily: "Montserrat_500Medium",
    fontSize: dpx(16),
    color: Colors.black,
  },
  optionContainer: {
    alignSelf: "stretch",
    marginBottom: dpx(10),
  },
  scrollContainer: {
    alignItems: "center",
  },
  imagesContainer: {
    marginVertical: dpx(20),
    height: dpx(130),
    alignSelf: "center",
  },
  input: {
    width: "90%",
    borderColor: Colors.lightGray,
    borderWidth: 1,
    borderRadius: dpx(10),
    color: Colors.black,
    padding: dpx(10),
    marginBottom: dpx(10),
    fontFamily: "Montserrat_400Regular",
    fontSize: dpx(14),
  },
  cityContainer: {
    marginVertical: dpx(10),
    width: dpx(170),
    borderRadius: dpx(10),
    borderWidth: 1,
    borderColor: Colors.lightGray,
  },
  noImageContainer: {
    borderWidth: 1,
    borderStyle: "dashed",
    borderColor: Colors.lightGray,
    borderRadius: dpx(20),
    width: dpx(130),
    height: dpx(130),
    alignItems: "center",
    justifyContent: "center",
  },
});
