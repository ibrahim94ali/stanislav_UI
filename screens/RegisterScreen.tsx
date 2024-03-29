import { useApolloClient, useMutation, useReactiveVar } from "@apollo/client";
import React, { useRef, useState } from "react";
import {
  StyleSheet,
  TextInput,
  View,
  Text,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import {
  DELETE_USER,
  REGISTER_USER,
  UPDATE_PASSWORD,
  UPDATE_USER,
} from "../graphQL/Mutations";
import PhoneInput from "react-native-phone-number-input";
import Colors from "../constants/Colors";
import { dpx } from "../constants/Spacings";
import { ScrollView } from "react-native-gesture-handler";
import Button from "../components/Button";
import LoadingSpinner from "../components/LoadingSpinner";
import { useTranslation } from "react-i18next";
import { SafeAreaView } from "react-native-safe-area-context";
import Header from "../components/Header";
import IconButton from "../components/IconButton";
import { AntDesign, Ionicons } from "@expo/vector-icons";
import { setUser, userVar } from "../Store";
import { profileTypes } from "../constants/Selectable";
import FilterOptions from "../components/FilterOptions";

export default function RegisterScreen({
  navigation,
  route,
}: {
  navigation: any;
  route: any;
}) {
  const { t } = useTranslation();
  const user = useReactiveVar(userVar);
  const client = useApolloClient();

  const isEditing = route?.params?.isEditing || null;

  const [email, onEmailChange] = useState("");
  const [oldPassword, onOldPasswordChange] = useState("");
  const [password, onPasswordChange] = useState("");
  const [confirmPassword, onConfirmPasswordChange] = useState("");
  const [name, onNameChange] = useState(isEditing && user ? user.name : "");
  const [phone, onPhoneChange] = useState(
    isEditing && user ? user.phoneNumber.shortPhoneNumber : ""
  );
  const [phoneCountryCode] = useState(
    isEditing && user ? user.phoneNumber.countryCodeName : "MK"
  );
  const [type, setType] = useState(isEditing && user ? user.type : "person");

  //refs for inputs
  const ref_password = useRef<TextInput>(null);
  const ref_confirmPassword = useRef<TextInput>(null);
  const ref_name = useRef<TextInput>(null);
  const ref_phoneInput = useRef<PhoneInput>(null);
  const ref_phoneNumber = useRef<TextInput>(null);

  const [createUser, { loading: loadingCreateUser }] =
    useMutation(REGISTER_USER);
  const [updateUser, { loading: isLoadingUpdateUser }] =
    useMutation(UPDATE_USER);
  const [updatePassword, { loading: isLoadingUpdatePassword }] =
    useMutation(UPDATE_PASSWORD);
  const [deleteUser, { loading: isDeletingUser }] = useMutation(DELETE_USER);

  const handleDelete = () => {
    Alert.alert(t("DELETE_MODAL.TITLE"), t("DELETE_MODAL.USER_MSG"), [
      {
        text: t("CANCEL"),
      },
      {
        text: t("OK"),
        onPress: () => {
          deleteUser().then(async () => {
            setUser(null);
            client.resetStore();
            navigation.goBack();
          });
        },
      },
    ]);
  };

  const handleSubmit = () => {
    if (!ref_phoneInput.current) return;

    const { number } =
      ref_phoneInput.current.getNumberAfterPossiblyEliminatingZero();
    const phoneNumber = {
      countryCode: `+${ref_phoneInput.current.getCallingCode()}`,
      countryCodeName: ref_phoneInput.current.getCountryCode(),
      shortPhoneNumber: number,
    };
    if (isEditing) {
      updateUser({
        variables: {
          name: name,
          phoneNumber: phoneNumber,
          type: type,
        },
      }).then((data: any) => {
        const updatedUser = {
          ...data.data.updateUser,
          token: user?.token,
        };
        setUser(updatedUser);
        navigation.goBack();
      });
    } else {
      createUser({
        variables: {
          email: email,
          password: password,
          name: name,
          phoneNumber: phoneNumber,
          type: type,
        },
      }).then((data: any) => {
        setUser(data.data.register || null);
        navigation.goBack();
      });
    }
  };

  const handlePasswordSubmit = () => {
    updatePassword({
      variables: {
        password: oldPassword,
        newPassword: password,
      },
    }).then(() => {
      navigation.goBack();
    });
  };

  const registerFormView = () => (
    <ScrollView contentContainerStyle={styles.actions}>
      {!isEditing && (
        <TextInput
          style={styles.input}
          onChangeText={(text) => onEmailChange(text)}
          value={email}
          placeholder={t("REGISTER.EMAIL") + " *"}
          placeholderTextColor={Colors.gray}
          textContentType="emailAddress"
          keyboardType="email-address"
          autoCapitalize="none"
          returnKeyType="next"
          autoFocus={!isEditing}
          onSubmitEditing={() => ref_password.current?.focus()}
        ></TextInput>
      )}

      {!isEditing && (
        <TextInput
          style={styles.input}
          onChangeText={(text) => onPasswordChange(text)}
          value={password}
          placeholder={t("REGISTER.PASSWORD") + " *"}
          placeholderTextColor={Colors.gray}
          secureTextEntry
          textContentType="password"
          autoCapitalize="none"
          returnKeyType="next"
          onSubmitEditing={() => ref_confirmPassword.current?.focus()}
          ref={ref_password}
        ></TextInput>
      )}
      {!isEditing && (
        <TextInput
          style={styles.input}
          onChangeText={(text) => onConfirmPasswordChange(text)}
          value={confirmPassword}
          placeholder={t("REGISTER.CONFIRM_PASSWORD") + " *"}
          placeholderTextColor={Colors.gray}
          secureTextEntry
          textContentType="password"
          autoCapitalize="none"
          returnKeyType="next"
          onSubmitEditing={() => ref_name.current?.focus()}
          ref={ref_confirmPassword}
        ></TextInput>
      )}
      <TextInput
        style={styles.input}
        onChangeText={(text) => onNameChange(text)}
        value={name}
        placeholder={t("REGISTER.NAME") + " *"}
        placeholderTextColor={Colors.gray}
        textContentType="name"
        returnKeyType="next"
        onSubmitEditing={() => ref_phoneNumber.current?.focus()}
        ref={ref_name}
      ></TextInput>
      <View style={styles.phoneWrapper}>
        <PhoneInput
          ref={ref_phoneInput}
          defaultCode={phoneCountryCode as any}
          defaultValue={phone}
          layout="first"
          containerStyle={styles.phoneContainer}
          textContainerStyle={styles.phoneTextContainer}
          codeTextStyle={styles.phoneCodeTextStyle}
          textInputStyle={styles.phoneTextInputStyle}
          textInputProps={{
            placeholder: "xxxxxxxx",
            keyboardType: "phone-pad",
            // @ts-ignore
            ref: ref_phoneNumber,
          }}
          onChangeFormattedText={(text) => {
            onPhoneChange(text);
          }}
        />
      </View>
      <View style={styles.optionContainer}>
        <FilterOptions
          title={t("REGISTER.TYPE")}
          items={profileTypes}
          value={type}
          onValueChange={(itemValue: string) => {
            setType(itemValue);
          }}
        />
      </View>
      <View style={styles.buttonContainer}>
        <Button
          title={isEditing ? t("ADD_EDIT_APT.SUBMIT") : t("PROFILE.REGISTER")}
          color={Colors.primary}
          onPress={handleSubmit}
          disabled={
            (!isEditing && !email) ||
            (!isEditing && !password) ||
            !name ||
            !ref_phoneInput.current?.isValidNumber(phone) ||
            (!isEditing && password.length < 6) ||
            (!isEditing && password !== confirmPassword)
          }
        />
      </View>

      {/* Update password */}
      {isEditing && (
        <View style={styles.updatePasswordContainer}>
          <Text style={styles.updatePasswordHeader}>
            {t("REGISTER.UPDATE_PASSWORD")}
          </Text>
          <TextInput
            style={styles.input}
            onChangeText={(text) => onOldPasswordChange(text)}
            value={oldPassword}
            placeholder={t("REGISTER.CURRENT_PASSWORD") + " *"}
            placeholderTextColor={Colors.gray}
            secureTextEntry
            textContentType="password"
            autoCapitalize="none"
            returnKeyType="next"
            onSubmitEditing={() => ref_password.current?.focus()}
          ></TextInput>
          <TextInput
            style={styles.input}
            onChangeText={(text) => onPasswordChange(text)}
            value={password}
            placeholder={t("REGISTER.NEW_PASSWORD") + " *"}
            placeholderTextColor={Colors.gray}
            secureTextEntry
            textContentType="password"
            autoCapitalize="none"
            returnKeyType="next"
            onSubmitEditing={() => ref_confirmPassword.current?.focus()}
            ref={ref_password}
          ></TextInput>
          <TextInput
            style={styles.input}
            onChangeText={(text) => onConfirmPasswordChange(text)}
            value={confirmPassword}
            placeholder={t("REGISTER.CONFIRM_NEW_PASSWORD") + " *"}
            placeholderTextColor={Colors.gray}
            secureTextEntry
            textContentType="password"
            autoCapitalize="none"
            returnKeyType="done"
            ref={ref_confirmPassword}
          ></TextInput>
          <View style={styles.buttonContainer}>
            <Button
              title={t("ADD_EDIT_APT.SUBMIT")}
              color={Colors.primary}
              onPress={handlePasswordSubmit}
              disabled={
                !oldPassword ||
                !password ||
                password.length < 6 ||
                password !== confirmPassword
              }
            />
          </View>
        </View>
      )}
    </ScrollView>
  );

  return (
    <SafeAreaView edges={["top"]} style={styles.container}>
      {(loadingCreateUser ||
        isLoadingUpdatePassword ||
        isLoadingUpdateUser ||
        isDeletingUser) && <LoadingSpinner />}
      <Header>
        <IconButton handlePress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" color={Colors.black} size={dpx(24)} />
        </IconButton>
        <Text style={styles.title}>
          {isEditing ? t("PROFILE.YOUR_PROFILE") : t("PROFILE.REGISTER")}
        </Text>
        {isEditing ? (
          <IconButton handlePress={() => handleDelete()}>
            <AntDesign name="delete" color={Colors.red} size={dpx(24)} />
          </IconButton>
        ) : (
          <View style={{ width: dpx(40) }}></View>
        )}
      </Header>
      {Platform.OS === "ios" && (
        <KeyboardAvoidingView style={{ flex: 1 }} behavior="padding">
          {registerFormView()}
        </KeyboardAvoidingView>
      )}
      {Platform.OS === "android" && registerFormView()}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.bg,
  },
  title: {
    fontFamily: "Montserrat_500Medium",
    fontSize: dpx(16),
    color: Colors.black,
  },
  actions: {
    alignItems: "center",
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
  phoneWrapper: {
    width: "90%",
    borderWidth: 1,
    borderColor: Colors.lightGray,
    borderRadius: dpx(10),
    marginBottom: dpx(10),
    overflow: "hidden",
  },
  phoneContainer: {
    backgroundColor: Colors.bg,
  },
  phoneTextContainer: {
    backgroundColor: Colors.bg,
  },
  phoneTextInputStyle: {
    fontFamily: "Montserrat_400Regular",
    fontSize: dpx(14),
    color: Colors.black,
  },
  phoneCodeTextStyle: {
    fontFamily: "Montserrat_400Regular",
    fontSize: dpx(14),
    color: Colors.black,
  },
  optionContainer: {
    alignSelf: "stretch",
    marginBottom: dpx(10),
  },
  buttonContainer: {
    marginVertical: dpx(20),
  },
  updatePasswordContainer: {
    alignSelf: "stretch",
    alignItems: "center",
  },
  updatePasswordHeader: {
    fontFamily: "Montserrat_500Medium",
    fontSize: dpx(16),
    color: Colors.black,
    marginVertical: dpx(20),
  },
});
