import { useMutation } from "@apollo/client";
import {
  connectActionSheet,
  useActionSheet,
} from "@expo/react-native-action-sheet";
import { useNavigation } from "@react-navigation/core";
import { observer } from "mobx-react";
import React, { useEffect } from "react";
import {
  StyleSheet,
  Text,
  TouchableWithoutFeedback,
  View,
  FlatList,
  Alert,
} from "react-native";
import { DELETE_APARTMENT } from "../graphQL/Mutations";
import { useStore } from "../hooks/StoreContext";
import { ApartmentI } from "../interfaces";
import Apartment from "./Apartment";

const ApartmentList = ({ data, editable = false }: any) => {
  const navigation = useNavigation();
  const { showActionSheetWithOptions } = useActionSheet();

  const store = useStore();

  const [deleteApartment, { data: deletedApartment }] = useMutation(
    DELETE_APARTMENT
  );

  useEffect(() => {
    if (deletedApartment) {
      store.deleteApartment(deletedApartment.deleteApartment.id);
    }
  }, [deletedApartment]);

  const handleActionSheetActions = (index: number, item: ApartmentI) => {
    switch (index) {
      case 0:
        // setIsEditingApartment(item);
        break;
      case 1:
        Alert.alert(
          "Are you sure",
          "This apartment will be deleted permenantely",
          [
            {
              text: "Cancel",
            },
            {
              text: "OK",
              onPress: () => {
                deleteApartment({
                  variables: {
                    id: item.id,
                  },
                });
              },
            },
          ]
        );
        break;
      default:
        break;
    }
  };

  const showActionSheet = (item: ApartmentI) => {
    showActionSheetWithOptions(
      {
        title: item.title,
        options: ["Edit", "Delete"],
        cancelButtonIndex: -1,
        destructiveButtonIndex: 1,
      },
      (index) => handleActionSheetActions(index, item)
    );
  };

  const renderItem = ({ item }: { item: ApartmentI }) => (
    <TouchableWithoutFeedback
      onPress={() => {
        navigation.navigate("ApartmentDetailsScreen", { apartment: item });
      }}
      onLongPress={() => {
        if (editable) showActionSheet(item);
      }}
    >
      <View>
        <Apartment apartment={item} />
      </View>
    </TouchableWithoutFeedback>
  );
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{data.length} Apartments</Text>
      <FlatList
        data={data}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
      />
    </View>
  );
};

export default connectActionSheet(observer(ApartmentList));

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    alignSelf: "center",
    marginVertical: 20,
  },
});
