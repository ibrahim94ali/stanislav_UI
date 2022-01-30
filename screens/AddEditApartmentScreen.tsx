import { gql, useMutation, useQuery } from "@apollo/client";
import React, { useEffect, useRef, useState } from "react";
import {
  StyleSheet,
  View,
  Image,
  ScrollView,
  Alert,
  Text,
  Platform,
} from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
import { TextInput } from "react-native-gesture-handler";
import Colors from "../constants/Colors";
import { ADD_APARTMENT, UPDATE_APARTMENT } from "../graphQL/Mutations";
import * as ImagePicker from "expo-image-picker";
import { ReactNativeFile } from "apollo-upload-client";
import ImageView from "react-native-image-viewing";
import * as Location from "expo-location";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import {
  AdType,
  AmenityType,
  ApartmentI,
  BuildingType,
  CityType,
  HeatingType,
} from "../interfaces";
import {
  buildingTypes,
  adTypes,
  furnishingTypes,
  heatingTypes,
  amenityTypes,
  wheelChairAccessibleTypes,
} from "../constants/Selectable";
import * as ImageManipulator from "expo-image-manipulator";
import LoadingSpinner from "../components/LoadingSpinner";
import { dpx } from "../constants/Spacings";
import Button from "../components/Button";
import Header from "../components/Header";
import IconButton from "../components/IconButton";
import LocationPicker from "../components/LocationPicker";
import FilterOptions from "../components/FilterOptions";
import RNPickerSelect from "react-native-picker-select";
import { pickerSelectStyles } from "../constants/PickerStyle";
import { useTranslation } from "react-i18next";
import { SafeAreaView } from "react-native-safe-area-context";
import { GET_CITIES } from "../graphQL/Queries";

const PHOTO_UPLOAD_LIMIT = 10;

const AddEditApartmentScreen = ({ navigation, route }: any) => {
  const { t } = useTranslation();
  const { data: cities, loading: isCityLoading } = useQuery(GET_CITIES);

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
  const [isWheelChairAccessible, setIsWheelChairAccessible] = useState<boolean>(
    itemOnEdit ? itemOnEdit.isWheelChairAccessible : true
  );
  const [heatingType, setHeatingType] = useState<HeatingType>(
    itemOnEdit ? itemOnEdit.heatingType : HeatingType.NONE
  );
  const [floor, setFloor] = useState(itemOnEdit ? itemOnEdit.floor : undefined);
  const [age, setAge] = useState(itemOnEdit ? itemOnEdit.age : undefined);

  const [msquare, setMsquare] = useState(
    itemOnEdit ? itemOnEdit.msquare : undefined
  );
  const [roomCount, setRoomCount] = useState(
    itemOnEdit ? itemOnEdit.roomCount : undefined
  );
  const [geolocation, setGeolocation] = useState<number[]>(
    itemOnEdit ? itemOnEdit.geolocation : [0, 0]
  );
  const [amenities, setAmenities] = useState<string[]>(
    itemOnEdit ? itemOnEdit.amenities : []
  );

  const [uploadImages, setUploadImages] = useState<string[]>([]);

  const [oldImages, setOldImages] = useState<string[]>(
    itemOnEdit ? itemOnEdit.photos : []
  );

  const [isFullScreen, setIsFullScreen] = useState(false);
  const [fullScreenPhotoIndex, setFullScreenPhotoIndex] = useState(0);

  //refs for inputs
  const ref_description = useRef<TextInput>();
  const ref_address = useRef<TextInput>();
  const ref_area = useRef<TextInput>();
  const ref_room = useRef<TextInput>();
  const ref_floor = useRef<TextInput>();
  const ref_age = useRef<TextInput>();

  const pickImage = async () => {
    const { status: statusImagePicker } =
      await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (statusImagePicker !== "granted") {
      Alert.alert(t("PERMISSIONS.SORRY"), t("PERMISSIONS.CAMERA_ROLL"));
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
      if (itemOnEdit) {
        return;
      }
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        Alert.alert(t("PERMISSIONS.SORRY"), t("PERMISSIONS.ADDRESS"));
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      if (location?.coords) {
        setGeolocation([location.coords.latitude, location.coords.longitude]);
      }
    })();
  }, []);

  const handleDeletePhotoModal = (index: number, isNew: boolean) => {
    Alert.alert(t("DELETE_MODAL.PHOTO_TITLE"), t("DELETE_MODAL.PHOTO_MSG"), [
      {
        text: t("CANCEL"),
      },
      {
        text: t("OK"),
        onPress: () => {
          deletePhoto(index, isNew);
        },
      },
    ]);
  };

  const deletePhoto = (index: number, isNew: boolean) => {
    if (isNew) {
      setUploadImages([
        ...uploadImages.slice(0, index),
        ...uploadImages.slice(index + 1),
      ]);
    } else {
      setOldImages([
        ...oldImages.slice(0, index),
        ...oldImages.slice(index + 1),
      ]);
    }
  };

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
          geolocation,
          address,
          city,
          price,
          buildingType,
          adType,
          heatingType,
          amenities,
          oldPhotosLinks: oldImages,
          newPhotos: photos,
          msquare,
          roomCount: buildingType !== BuildingType.LAND ? roomCount : 0,
          floor: buildingType !== BuildingType.LAND ? floor : 0,
          age: buildingType !== BuildingType.LAND ? age : 0,
          isFurnished,
          isWheelChairAccessible,
        },
      });
      return;
    }

    addApartment({
      variables: {
        title,
        details,
        geolocation,
        address,
        city,
        price,
        buildingType,
        adType,
        heatingType,
        amenities,
        photos,
        msquare,
        roomCount: buildingType !== BuildingType.LAND ? roomCount : 0,
        floor: buildingType !== BuildingType.LAND ? floor : 0,
        age: buildingType !== BuildingType.LAND ? age : 0,
        isFurnished,
        isWheelChairAccessible,
      },
    });
  };

  const attemptGeocodeAsync = async () => {
    if (!address) return;

    const { status: statusLocation } =
      await Location.requestForegroundPermissionsAsync();

    if (statusLocation !== "granted") {
      Alert.alert(t("PERMISSIONS.SORRY"), t("PERMISSIONS.ADDRESS"));
      return;
    }

    try {
      const result = await Location.geocodeAsync(address + `, ${city}`);
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

  const PhotoViewer = ({ photo, index, isNew }: any) => (
    <View style={{ marginRight: 10 }}>
      <TouchableOpacity
        onPress={() => {
          setFullScreenPhotoIndex(index);
          setIsFullScreen(true);
        }}
        onLongPress={() => handleDeletePhotoModal(index, isNew)}
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
      {(loadingNewApartment || loadingUpatedApartment || isCityLoading) && (
        <LoadingSpinner />
      )}
      <Header>
        <IconButton handlePress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" color={Colors.black} size={dpx(24)} />
        </IconButton>
        <Text style={styles.header}>
          {itemOnEdit ? t("ADD_EDIT_APT.EDIT") : t("ADD_EDIT_APT.ADD")}
        </Text>
        <IconButton
          handlePress={pickImage}
          disabled={
            uploadImages.length + oldImages.length >= PHOTO_UPLOAD_LIMIT
          }
        >
          <MaterialIcons
            name="add-photo-alternate"
            size={dpx(24)}
            color={
              uploadImages.length + oldImages.length >= PHOTO_UPLOAD_LIMIT
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
              <PhotoViewer key={photo} photo={photo} index={index} />
            ))}
            {uploadImages.map((photo, index) => (
              <PhotoViewer
                key={photo}
                photo={photo}
                index={index}
                isNew={true}
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
          returnKeyType="next"
          onSubmitEditing={() => ref_description.current?.focus()}
        />
        <TextInput
          style={[styles.input, styles.description]}
          value={details}
          multiline
          placeholder={t("ADD_EDIT_APT.FIELDS.DESCRIPTION") + " *"}
          placeholderTextColor={Colors.gray}
          onChangeText={(value) => setDetails(value)}
          ref={ref_description as any}
          returnKeyType="next"
        />

        <View style={styles.cityContainer}>
          <RNPickerSelect
            placeholder={{}}
            value={city}
            onValueChange={(itemValue: CityType) => {
              setCity(itemValue);
              if (Platform.OS === "android") {
                ref_address.current?.focus();
              }
            }}
            items={cities.cities}
            style={pickerSelectStyles}
            onDonePress={() => ref_address.current?.focus()}
          />
        </View>

        <TextInput
          style={styles.input}
          value={address}
          placeholder={t("ADD_EDIT_APT.FIELDS.ADDRESS") + " *"}
          placeholderTextColor={Colors.gray}
          onChangeText={(value) => setAddress(value)}
          onSubmitEditing={attemptGeocodeAsync}
          ref={ref_address as any}
          returnKeyType="search"
        />

        <LocationPicker
          addressGeoCode={geolocation}
          onSave={(lat: number, lon: number) => setGeolocation([lat, lon])}
        />

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
          returnKeyType="next"
          onSubmitEditing={() => ref_area.current?.focus()}
        />
        <TextInput
          style={styles.input}
          value={msquare?.toString() || ""}
          placeholder={t("ADD_EDIT_APT.FIELDS.AREA") + " (m2) *"}
          placeholderTextColor={Colors.gray}
          onChangeText={(value) => {
            if (parseInt(value)) {
              setMsquare(parseInt(value));
            } else {
              setMsquare(undefined);
            }
          }}
          keyboardType="numeric"
          returnKeyType="next"
          ref={ref_area as any}
          onSubmitEditing={() =>
            buildingType !== BuildingType.LAND
              ? ref_room.current?.focus()
              : null
          }
        />

        {buildingType !== BuildingType.LAND && (
          <View style={[styles.scrollContainer, { alignSelf: "stretch" }]}>
            <TextInput
              style={styles.input}
              value={roomCount?.toString() || ""}
              placeholder={t("ADD_EDIT_APT.FIELDS.ROOMS") + " *"}
              placeholderTextColor={Colors.gray}
              onChangeText={(value) => {
                if (parseInt(value) || value === "0") {
                  setRoomCount(parseInt(value));
                } else {
                  setRoomCount(undefined);
                }
              }}
              keyboardType="numeric"
              returnKeyType="next"
              ref={ref_room as any}
              onSubmitEditing={() => ref_floor.current?.focus()}
            />
            <TextInput
              style={styles.input}
              value={floor?.toString() || ""}
              placeholder={t("ADD_EDIT_APT.FIELDS.FLOOR") + " *"}
              placeholderTextColor={Colors.gray}
              onChangeText={(value) => {
                if (parseInt(value) || value === "0") {
                  setFloor(parseInt(value));
                } else {
                  setFloor(undefined);
                }
              }}
              keyboardType="numeric"
              returnKeyType="next"
              ref={ref_floor as any}
              onSubmitEditing={() => ref_age.current?.focus()}
            />
            <TextInput
              style={styles.input}
              value={age?.toString() || ""}
              placeholder={`${t("ADD_EDIT_APT.FIELDS.AGE")} (${t(
                "ADD_EDIT_APT.FIELDS.0_FOR_NEW"
              )})  *`}
              placeholderTextColor={Colors.gray}
              onChangeText={(value) => {
                if (parseInt(value) || value === "0") {
                  setAge(parseInt(value));
                } else {
                  setAge(undefined);
                }
              }}
              keyboardType="numeric"
              returnKeyType="next"
              ref={ref_age as any}
            />
          </View>
        )}

        <View
          style={[
            styles.optionContainer,
            {
              marginBottom:
                buildingType === BuildingType.LAND ? dpx(110) : dpx(10),
            },
          ]}
        >
          <FilterOptions
            title={t("ADD_EDIT_APT.AD_TYPE")}
            items={adTypes}
            value={adType}
            onValueChange={(itemValue: AdType) => {
              setAdType(itemValue);
            }}
          />
        </View>
        {buildingType !== BuildingType.LAND && (
          <View style={[styles.scrollContainer, { alignSelf: "stretch" }]}>
            <View style={styles.optionContainer}>
              <FilterOptions
                title={t("ADD_EDIT_APT.FURNISHING")}
                items={furnishingTypes}
                value={isFurnished}
                onValueChange={(itemValue: boolean) => {
                  setIsFurnished(itemValue);
                }}
              />
            </View>
            <View style={styles.optionContainer}>
              <FilterOptions
                title={t("ADD_EDIT_APT.ACCESSIBILITY")}
                items={wheelChairAccessibleTypes}
                value={isWheelChairAccessible}
                onValueChange={(itemValue: boolean) => {
                  setIsWheelChairAccessible(itemValue);
                }}
              />
            </View>
            <View style={styles.optionContainer}>
              <FilterOptions
                title={t("ADD_EDIT_APT.HEATING")}
                items={heatingTypes}
                value={heatingType}
                onValueChange={(itemValue: HeatingType) => {
                  setHeatingType(itemValue);
                }}
              />
            </View>
            <View style={styles.optionContainer}>
              <FilterOptions
                title={t("ADD_EDIT_APT.AMENITIES")}
                multiple
                items={amenityTypes}
                value={amenities}
                onValueChange={(itemValues: AmenityType[]) => {
                  setAmenities(itemValues);
                }}
              />
            </View>
          </View>
        )}
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
            (roomCount === undefined && buildingType !== BuildingType.LAND) ||
            (floor === undefined && buildingType !== BuildingType.LAND) ||
            (age === undefined && buildingType !== BuildingType.LAND) ||
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
    backgroundColor: Colors.bg,
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
  description: {
    height: dpx(80),
  },
  cityContainer: {
    marginBottom: dpx(10),
    borderRadius: dpx(10),
    borderWidth: 1,
    borderColor: Colors.lightGray,
    alignSelf: "stretch",
    marginHorizontal: dpx(20),
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
