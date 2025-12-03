import React, { useState, useCallback, useEffect } from "react";
import { View, Text, TextInput, TouchableOpacity, Image, Alert, ScrollView } from "react-native";
import { useSelector, useDispatch } from "react-redux";
import { Header, InputText, notificationHelper } from "@src/commonComponent";
import { appColors, appFonts, fontSizes, windowHeight } from "@src/themes";
import DropDownPicker from "react-native-dropdown-picker";
import { CloseIcon, Download } from "@src/utils/icons";
import DocumentPicker from "react-native-document-picker";
import { departmentDataGet, priorityDataGet, ticketDataGet } from "../../../api/store/actions/ticketAction";
import styles from "./styles";
import { clearValue, getValue } from "@src/utils/localstorage";
import { useNavigation } from "@react-navigation/native";
import { URL } from "@src/api/config";
import { useValues } from "@src/utils/context/index";;

export function CreateTicket() {
  const dispatch = useDispatch();
  const [subjectValue, setSubjectValue] = useState("");
  const [description, setDescription] = useState("");
  const [open, setOpen] = useState(false);
  const [selectedPriority, setSelectedPriority] = useState(null);
  const [priorityList, setPriorityList] = useState([]);
  const [openDepartment, setOpenDepartment] = useState(false);
  const [selectedDepartment, setSelectedDepartment] = useState(null);
  const [departmentList, setDepartmentList] = useState([]);
  const [files, setFiles] = useState([]);
  const { priorityData, departmentData } = useSelector((state: any) => state.tickets);
  const { translateData } = useSelector((state) => state.setting);
  const [subjectError, setSubjectError] = useState('');
  const [descriptionError, setDescriptionError] = useState('');
  const [priorityError, setPriorityError] = useState('');
  const [departmentError, setDepartmentError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigation = useNavigation();


  const { goBack } = useNavigation();
  const { linearColorStyle, bgFullLayout, textColorStyle, textRTLStyle, isDark, isRTL, viewRTLStyle } = useValues();

  useEffect(() => {
    dispatch(priorityDataGet());
    dispatch(departmentDataGet());
  }, []);

  type dropdownProps = {
    name: string;
    id: string;
  };
  useEffect(() => {
    if (priorityData?.data) {
      setPriorityList(
        priorityData?.data?.map((item: dropdownProps) => ({
          label: item.name,
          value: item.id,
        }))
      );
    }
    if (departmentData?.data) {
      setDepartmentList(
        departmentData?.data?.map((item: dropdownProps) => ({
          label: item.name,
          value: item.id,
        }))
      );
    }
  }, [priorityData, departmentData]);


  const handleDocumentUpload = useCallback(async () => {
    try {
      const response = await DocumentPicker.pick({
        type: [DocumentPicker.types.allFiles],
        allowMultiSelection: true,
      });

      if (response && response.length > 0) {
        setFiles((prevFiles) => {
          const updatedFiles = [...prevFiles, ...response];
          return updatedFiles;
        });
      }
    } catch (err) {
      if (!DocumentPicker.isCancel(err)) {
      }
    }
  }, []);


  const handleRemoveFile = (index: number) => {
    const updatedFiles = files.filter((_, i) => i !== index);
    setFiles(updatedFiles);
  };


  const TicketRequest = async () => {
    let isValid = true;

    if (!subjectValue.trim()) {
      setSubjectError(translateData.enterSubjecttttt);
      isValid = false;
    } else {
      setSubjectError('');
    }

    if (!description.trim()) {
      setDescriptionError(translateData.ticketPleaseEnterdescriptionnnn);
      isValid = false;
    } else {
      setDescriptionError('');
    }

    if (!selectedPriority) {
      setPriorityError(translateData.selectPriority);
      isValid = false;
    } else {
      setPriorityError('');
    }

    if (!selectedDepartment) {
      setDepartmentError(translateData.selectDepartment);
      isValid = false;
    } else {
      setDepartmentError('');
    }
    if (!isValid) {
      return;
    }

    setLoading(true);
    const token = await getValue("token");

    try {
      const formData = new FormData();
      formData.append("subject", subjectValue);
      formData.append("description", description);
      formData.append("priority_id", selectedPriority);
      formData.append("department_id", selectedDepartment);

      if (files.length > 0) {
        files.forEach((file, index) => {
          formData.append(`attachments[${index}]`, {
            uri: file.uri,
            name: file.name || `file-${index}`,
            type: file.type || "application/octet-stream",
          });
        });
      }

      const response = await fetch(`${URL}/api/ticket`, {
        method: "POST",
        body: formData,
        headers: {
          "Content-Type": "multipart/form-data",
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      const responseData = await response.json();

      if (response.status == 403) {
        notificationHelper('', translateData.loginAgain, 'error');
        await clearValue('token');
        navigation.reset({
          index: 0,
          routes: [{ name: 'SignIn' }],
        });
        return;
      }

      if (response.ok && responseData.id) {
        goBack();

        try {
          const res: any = await dispatch(ticketDataGet()).unwrap();

          if (res.status == 403) {
            notificationHelper('', translateData.loginAgain, 'error');
            await clearValue('token');
            navigation.reset({
              index: 0,
              routes: [{ name: 'SignIn' }],
            });
            return;
          }

          notificationHelper('', translateData.ticketCreateSuccess, 'success');
        } catch (dispatchError) {
          notificationHelper('', translateData.ticketFailed, 'error');
        }
      } else {
        notificationHelper("", responseData.message || translateData.ticketFail, 'error');
      }
    } catch (error) {
      Alert.alert("Error", translateData.unexpectedError);
    } finally {
      setLoading(false);
    }
  };


  return (
    <View style={{ backgroundColor: linearColorStyle, height: "100%" }}>
      <Header value={translateData.createTicket} />
      <ScrollView style={styles.mainInput} showsVerticalScrollIndicator={false}>
        <View>
          <InputText
            title={translateData.subject}
            placeholder={translateData.enterSubject}
            showTitle={true}
            value={subjectValue}
            onChangeText={(text) => {
              setSubjectValue(text);
              if (!text.trim()) {
                setSubjectError(translateData.enterSubjecttttt);
              } else {
                setSubjectError('');
              }
            }}
            borderColor={isDark ? appColors.darkBorder : appColors.border}
            placeholderTextColor={
              isDark ? appColors.darkText : appColors.regularText
            }
          />
          {subjectError ? <Text style={[styles.errorText, { top: windowHeight(5.7) }]}>{subjectError}</Text> : null}

        </View>
        <View>
          <Text
            style={[
              styles.fieldTitle,
              { color: textColorStyle },
              { textAlign: textRTLStyle },
              { fontFamily: appFonts.medium },
            ]}
          >
            {translateData.descriptionLabel}
          </Text>
          <TextInput
            style={[
              styles.descriptionField,
              { fontSize: fontSizes.FONT17 },
              { textAlign: textRTLStyle },
              { backgroundColor: isDark ? bgFullLayout : appColors.whiteColor },
              { borderColor: isDark ? appColors.darkBorder : appColors.border },
              { color: textColorStyle },
              { fontFamily: appFonts.regular },
            ]}
            placeholder={translateData.writehere}
            placeholderTextColor={
              isDark ? appColors.darkText : appColors.regularText
            }
            multiline={true}
            numberOfLines={3}
            maxLength={500}
            value={description}
            onChangeText={(text) => {
              setDescription(text);
              if (!text.trim()) {
                setDescriptionError(translateData.ticketPleaseEnterdescriptionnnn);
              } else {
                setDescriptionError('');
              }
            }} />
          {descriptionError ? <Text style={[styles.errorText, { top: windowHeight(7) }]}>{descriptionError}</Text> : null}

        </View>
        <Text
          style={[
            styles.fieldTitle,
            { color: textColorStyle },
            { textAlign: textRTLStyle },
            { marginTop: windowHeight(15) },
            { fontFamily: appFonts.medium },
          ]}
        >
          {translateData.priority}
        </Text>
        <DropDownPicker
          open={open}
          value={selectedPriority}
          items={priorityList}
          setOpen={setOpen}
          setValue={(callback) => {
            const value = callback(selectedPriority);
            setSelectedPriority(value);
            if (value) {
              setPriorityError('');
            }
          }}
          placeholder={translateData.selectPriority}
          style={[
            styles.dropDownContainer,
            {
              backgroundColor: isDark ? bgFullLayout : appColors.whiteColor,
              borderColor: isDark ? appColors.darkBorder : appColors.border,
              flexDirection: viewRTLStyle,
              paddingHorizontal: windowHeight(12),
            },
          ]}
          dropDownContainerStyle={{
            backgroundColor: isDark ? bgFullLayout : appColors.lightGray,
            borderColor: isDark ? appColors.darkBorder : appColors.border,
          }}
          tickIconStyle={{
            tintColor: isDark ? appColors.whiteColor : appColors.blackColor,
          }}
          textStyle={{
            textAlign: isRTL ? "right" : "left",
            color: isDark ? appColors.whiteColor : appColors.blackColor,
            fontFamily: appFonts.regular,
            fontSize: fontSizes.FONT17
          }}
          iconContainerStyle={{
            color: isDark ? appColors.whiteColor : appColors.blackColor,
          }}
          arrowIconStyle={{
            tintColor: isDark ? appColors.whiteColor : appColors.blackColor,
          }}
          placeholderStyle={{
            color: isDark ? appColors.darkText : appColors.regularText,
          }}
          dropDownDirection="TOP"
          zIndex={2}
          rtl={isRTL}
        />
        {priorityError ? <Text style={[styles.errorText, { top: windowHeight(2) }]}>{priorityError}</Text> : null}

        <Text
          style={[
            styles.fieldTitle,
            { color: textColorStyle },
            { textAlign: textRTLStyle },
            { bottom: windowHeight(2) },
            { fontFamily: appFonts.medium },
          ]}
        >
          {translateData.department}
        </Text>
        <View>
          <DropDownPicker
            open={openDepartment}
            value={selectedDepartment}
            items={departmentList}
            setOpen={setOpenDepartment}
            setValue={(callback) => {
              const value = callback(selectedDepartment);
              setSelectedDepartment(value);
              if (value) {
                setDepartmentError('');
              }
            }}
            placeholder={translateData.selectDepartment}
            style={[
              styles.dropDownContainer,
              {
                backgroundColor: isDark ? bgFullLayout : appColors.whiteColor,
                borderColor: isDark ? appColors.darkBorder : appColors.border,
                flexDirection: viewRTLStyle,
                paddingHorizontal: windowHeight(12),
              },
            ]}
            dropDownContainerStyle={{
              backgroundColor: isDark ? bgFullLayout : appColors.lightGray,
              borderColor: isDark ? appColors.darkBorder : appColors.border,
            }}
            tickIconStyle={{
              tintColor: isDark ? appColors.whiteColor : appColors.blackColor,
            }}
            textStyle={{
              textAlign: isRTL ? "right" : "left",
              color: isDark ? appColors.whiteColor : appColors.blackColor,
              fontFamily: appFonts.regular,
              fontSize: fontSizes.FONT17
            }}
            iconContainerStyle={{
              color: isDark ? appColors.whiteColor : appColors.blackColor,
            }}
            arrowIconStyle={{
              tintColor: isDark ? appColors.whiteColor : appColors.blackColor,
            }}
            placeholderStyle={{
              color: isDark ? appColors.darkText : appColors.regularText,
            }}
            dropDownDirection="TOP"
            zIndex={2}
            rtl={isRTL}
          />
          {departmentError ? <Text style={[styles.errorText, { top: windowHeight(3) }]}>{departmentError}</Text> : null}
        </View>
        <Text
          style={[
            styles.fieldTitle,
            { color: textColorStyle },
            { textAlign: textRTLStyle },
            { fontFamily: appFonts.medium },
          ]}
        >
          {translateData.uploadFile}
        </Text>
        <View>
          {files.length > 0 ? (
            <View style={[styles.imgContainer, { flexDirection: viewRTLStyle }]}>
              {files.map((file, index) => (
                <View key={index} style={[styles.imgView, { borderColor: isDark ? appColors.darkBorder : appColors.border }]}>
                  <TouchableOpacity
                    activeOpacity={0.7}

                    style={styles.closeIcon}
                    onPress={() => handleRemoveFile(index)}
                  >
                    <CloseIcon />
                  </TouchableOpacity>
                  {file.type?.includes("image") ? (
                    <Image source={{ uri: file?.uri }} style={styles.img} />
                  ) : (
                    <View style={styles.placeholder}>
                      <Text style={styles.placeholderText}>{file.name}</Text>
                    </View>
                  )}
                </View>
              ))}
            </View>
          ) : (
            <TouchableOpacity
              onPress={handleDocumentUpload}
              activeOpacity={0.7}
              style={[
                styles.docSelection,
                { backgroundColor: isDark ? bgFullLayout : appColors.whiteColor },
                { borderColor: isDark ? appColors.darkBorder : appColors.border },
              ]}
            >
              <View style={styles.docContainer}>
                <Download />
                <Text style={styles.uploadText}>{translateData.upload}</Text>
              </View>
            </TouchableOpacity>
          )}
        </View>
        <TouchableOpacity onPress={TicketRequest} style={styles.submitBtn} activeOpacity={0.7}
        >
          <Text style={styles.submitText}>{translateData.submit}</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}
