import { useMutation } from "@apollo/client";
import React, { useEffect, useState } from "react";
import { Button, StyleSheet } from "react-native";
import { TextInput } from "react-native-gesture-handler";
import { View } from "../components/Themed";
import Colors from "../constants/Colors";
import { ADD_APARTMENT } from "../graphQL/Mutations";
import { useStore } from "../hooks/StoreContext";

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
  // const [photos, setPhotos] = useState<string[]>([]);
  // const [geoLocation, setGeolocation] = useState<number[]>([]);

  const geolocation = [41.99646, 21.43141];
  const photos = [
    "https://i2.wp.com/www.discoveringmacedonia.com/wp-content/uploads/2019/06/skopje-city-mall.jpg?fit=1000%2C525&ssl=1",
    "https://balkaninsight.com/wp-content/uploads/2012/10/skopje-city-mall-by-build-mk4x3.jpg",
  ];

  const [addApartment, { data: newApartment }] = useMutation(ADD_APARTMENT);

  useEffect(() => {
    if (newApartment) {
      store.addApartment(newApartment.addApartment);
      navigation.navigate("HomeScreen");
    }
  }, [newApartment]);

  const handleSubmit = () => {
    console.log(
      "submit",
      title,
      details,
      address,
      price,
      type,
      msquare,
      roomCount
    );

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
        photos,
        msquare,
        roomCount,
      },
    });
  };
  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        autoFocus
        value={title}
        placeholder="Title"
        placeholderTextColor={Colors.white}
        onChangeText={(value) => setTitle(value)}
      />
      <TextInput
        style={styles.input}
        value={details}
        placeholder="Details"
        placeholderTextColor={Colors.white}
        onChangeText={(value) => setDetails(value)}
      />
      <TextInput
        style={styles.input}
        value={address}
        placeholder="Address"
        placeholderTextColor={Colors.white}
        onChangeText={(value) => setAddress(value)}
      />
      <TextInput
        style={styles.input}
        value={city}
        placeholder="City"
        placeholderTextColor={Colors.white}
        onChangeText={(value) => setCity(value)}
      />
      <TextInput
        style={styles.input}
        value={price?.toString()}
        placeholder="Price"
        placeholderTextColor={Colors.white}
        onChangeText={(value) => setPrice(+value)}
        keyboardType="numeric"
      />
      <TextInput
        style={styles.input}
        value={type}
        placeholder="Type"
        placeholderTextColor={Colors.white}
        onChangeText={(value) => setType(value)}
      />
      <TextInput
        style={styles.input}
        value={msquare?.toString()}
        placeholder="Meter Sqaure"
        placeholderTextColor={Colors.white}
        onChangeText={(value) => setMsquare(+value)}
        keyboardType="numeric"
      />
      <TextInput
        style={styles.input}
        value={roomCount?.toString()}
        placeholder="Rooms Count"
        placeholderTextColor={Colors.white}
        onChangeText={(value) => setRoomCount(+value)}
        keyboardType="numeric"
      />
      <View style={{ marginTop: 20 }}>
        <Button
          title="Submit"
          onPress={handleSubmit}
          disabled={
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
    padding: 30,
  },
  input: {
    padding: 10,
    borderColor: Colors.white,
    borderWidth: 1,
    marginBottom: 10,
    color: Colors.white,
    fontSize: 18,
  },
});
