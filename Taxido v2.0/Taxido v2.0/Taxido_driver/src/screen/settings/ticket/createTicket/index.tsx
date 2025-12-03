import React, { useState, useCallback, useEffect } from 'react'
import { View, Text, TextInput, TouchableOpacity, Image, ScrollView, } from 'react-native'
import { useSelector, useDispatch } from 'react-redux'
import { Input, Header, Button, notificationHelper, } from '../../../../commonComponents'
import { fontSizes } from '../../../../theme/appConstant'
import appColors from '../../../../theme/appColors'
import DropDownPicker from 'react-native-dropdown-picker'
import Icons from '../../../../utils/icons/icons'
import DocumentPicker from 'react-native-document-picker'
import styles from './styles'
import { getValue } from '../../../../utils/localstorage'
import { departmentDataGet, priorityDataGet, ticketDataGet } from '../../../../api/store/action/ticketAction'
import { URL } from '../../../../api/config'
import { useValues } from '../../../../utils/context'
import { useTheme } from '@react-navigation/native'
import { windowHeight } from '../../chat/context'
import { AppDispatch } from '../../../../api/store'
import { useAppNavigation } from '../../../../utils/navigation'

export function CreateTicket() {

  const navigation = useAppNavigation()
  const dispatch = useDispatch<AppDispatch>()
  const { colors } = useTheme()
  const { viewRtlStyle, textRtlStyle, rtl, isDark } = useValues()
  const [subjectValue, setSubjectValue] = useState<string>('')
  const [description, setDescription] = useState<string>('')
  const [open, setOpen] = useState<boolean>(false)
  const [selectedPriority, setSelectedPriority] = useState<any>(null)
  const [priorityList, setPriorityList] = useState<any>([])
  const [openDepartment, setOpenDepartment] = useState<boolean>(false)
  const [selectedDepartment, setSelectedDepartment] = useState<any>(null)
  const [departmentList, setDepartmentList] = useState<any>([])
  const [files, setFiles] = useState<any>([])
  const [subjectError, setSubjectError] = useState<string>('');
  const [descriptionError, setDescriptionError] = useState<string>('');
  const [priorityError, setPriorityError] = useState<string>('');
  const [departmentError, setDepartmentError] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false)
  const { priorityData, departmentData } = useSelector((state: any) => state.tickets)
  const { translateData } = useSelector((state: any) => state.setting)

  const handleRemoveFile = (index: number) => {
    setFiles((prevFiles: any) => {
      const updatedFiles = prevFiles.filter((_: any, i: number) => i !== index);
      return updatedFiles;
    });
  };

  useEffect(() => {
    dispatch(priorityDataGet())
    dispatch(departmentDataGet())
  }, [])

  useEffect(() => {
    if (priorityData?.data) {
      setPriorityList(
        priorityData.data.map((item: any) => ({
          label: item.name,
          value: item.id,
        })),
      )
    }
    if (departmentData?.data) {
      setDepartmentList(
        departmentData.data.map((item: any) => ({
          label: item.name,
          value: item.id,
        })),
      )
    }
  }, [priorityData, departmentData])


  const handleDocumentUpload = useCallback(async () => {
    try {
      const response = await DocumentPicker.pick({
        type: [DocumentPicker.types.allFiles],
        allowMultiSelection: true,
      });

      if (response && response.length > 0) {
        setFiles((prevFiles: any) => {
          const updatedFiles = [...prevFiles, ...response];
          return updatedFiles;
        });
      }
    } catch (err) {
      if (!DocumentPicker.isCancel(err)) {
      }
    }
  }, []);


  const TicketRequest = async () => {
    let isValid = true;



    if (!isValid) {
      return;
    }

    if (!subjectValue.trim()) {
      setSubjectError(translateData.subjectEnter);
      isValid = false;
    } else {
      setSubjectError('');
    }

    if (!description.trim()) {
      setDescriptionError(translateData.PleaseEntertextadescription);
      isValid = false;
    } else {
      setDescriptionError('');
    }

    if (!selectedPriority) {
      setPriorityError(translateData.selectPriorityy);
      isValid = false;
    } else {
      setPriorityError('');
    }

    if (!selectedDepartment) {
      setDepartmentError(translateData.selectDepartmentt);
      isValid = false;
    } else {
      setDepartmentError('');
    }

    if (!isValid) {
      return;
    }

    setLoading(true);
    const token = await getValue('token');
    try {
      const formData = new FormData();
      formData.append('subject', subjectValue);
      formData.append('description', description);
      formData.append('priority_id', selectedPriority);
      formData.append('department_id', selectedDepartment);

      if (files.length > 0) {
        files.forEach((file: any, index: number) => {
          formData.append(`attachments[${index}]`, {
            uri: file.uri,
            name: file.name || `file-${index}`,
            type: file.type || 'application/octet-stream',
          });
        });
      }

      const response = await fetch(`${URL}/api/ticket`, {
        method: 'POST',
        body: formData,
        headers: {
          'Content-Type': 'multipart/form-data',
          Accept: 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });
      const responseData = await response.json();

      if (response.ok) {
        if (responseData.id) {
          notificationHelper(
            '',
            translateData.ticketCreated,
            'success',
          );
          navigation.navigate('SupportTicket');
          dispatch(ticketDataGet());
        } else {
          setSubjectError(responseData.message || translateData.failedToCreateTicket);
        }
      } else {
        setSubjectError(translateData.serverError);
      }
    } catch (error) {
      setSubjectError(translateData.somethingWentWrong);
    } finally {
      setLoading(false);
    }
  };


  return (
    <View>
      <Header title={translateData.createTicket} />
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.inputContainer}>
          <View>
            <Input
              title={translateData.subject}
              placeholder={translateData.enterSubject}
              titleShow={true}
              value={subjectValue}
              onChangeText={(text) => {
                setSubjectValue(text);
                if (!text.trim()) {
                  setSubjectError(translateData.enterSubject);
                } else {
                  setSubjectError('');
                }
              }}
              backgroundColor={isDark ? colors.card : appColors.white}
            />
            {subjectError ? <Text style={styles.errorText}>{subjectError}</Text> : null}
          </View>
          <View>
            <Text
              style={[
                styles.fieldTitle,
                { textAlign: textRtlStyle },
                { color: isDark ? appColors.white : appColors.primaryFont },
              ]}
            >
              {translateData.descriptionCar}
            </Text>
            <TextInput
              style={[
                styles.descriptionField,
                { textAlign: textRtlStyle },
                { backgroundColor: isDark ? colors.card : appColors.white },
                { borderColor: colors.border },
                { color: isDark ? appColors.white : appColors.black },
              ]}
              placeholder={translateData.writeHeres}
              placeholderTextColor={
                isDark ? appColors.darkText : appColors.secondaryFont
              }
              multiline={true}
              numberOfLines={3}
              maxLength={500}
              value={description}
              onChangeText={(text) => {
                setDescription(text);
                if (!text.trim()) {
                  setDescriptionError(translateData.PleaseEntertextdescription);
                } else {
                  setDescriptionError('');
                }
              }}
            />
            {descriptionError ? <Text style={[styles.errorText, { top: windowHeight(7) }]}>{descriptionError}</Text> : null}

          </View>
          <Text
            style={[
              styles.fieldTitle1,
              { textAlign: textRtlStyle },
              { color: isDark ? appColors.white : appColors.primaryFont },
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
            dropDownContainerStyle={{
              backgroundColor: isDark ? colors.card : appColors.white,
              borderColor: colors.border,
            }}
            textStyle={[styles.text, { color: colors.text }]}
            placeholderStyle={[
              styles.placeholderStyle,
              { color: isDark ? appColors.darkText : appColors.secondaryFont },
            ]}
            labelStyle={[styles.text, { color: colors.text }]}
            tickIconStyle={{
              tintColor: isDark ? appColors.white : appColors.black,
            }}
            arrowIconStyle={{
              tintColor: isDark ? appColors.white : appColors.black,
            }}
            listItemLabelStyle={{
              color: isDark ? appColors.white : appColors.black,
            }}

            style={[
              {
                borderColor: isDark ? appColors.darkborder : appColors.border,
                backgroundColor: isDark ? appColors.darkThemeSub : appColors.white,
                flexDirection: viewRtlStyle,
              },
            ]}
            textStyle={{
              textAlign: rtl ? 'right' : 'left',
              color: colors.text,
              fontSize: fontSizes.FONT4,
            }}
            scrollViewProps={{
              showsVerticalScrollIndicator: false,
            }}
            zIndex={3}
            listMode="SCROLLVIEW"
            scrollViewProps={{
              showsVerticalScrollIndicator: false,
              nestedScrollEnabled: true,
            }}
            dropDownDirection="AUTO"
              ArrowDownIconComponent={({ style }) => (
                            <View style={[{ transform: [{ rotate: '-90deg' }] }]}>
                                <Icons.Back color={colors.text} />
                            </View>
                        )}
                        ArrowUpIconComponent={({ style }) => (
                            <View style={[{ transform: [{ rotate: '90deg' }] }]}>

                                <Icons.Back color={colors.text} />
                            </View>
                        )}
          />
          {priorityError ? <Text style={[styles.errorText, { top: windowHeight(5) }]}>{priorityError}</Text> : null}

          <Text
            style={[
              styles.fieldTitle2,
              { textAlign: textRtlStyle },
              { color: isDark ? appColors.white : appColors.primaryFont },
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
              placeholderStyle={[
                styles.placeholderStyle,
                { color: isDark ? appColors.darkText : appColors.secondaryFont },
              ]}
              dropDownContainerStyle={{
                backgroundColor: isDark ? colors.card : appColors.white,
                borderColor: colors.border,
              }}
              textStyle={[styles.text, { color: colors.text }]}
              labelStyle={[styles.text, { color: colors.text }]}
              tickIconStyle={{
                tintColor: isDark ? appColors.white : appColors.black,
              }}
              arrowIconStyle={{
                tintColor: isDark ? appColors.white : appColors.black,
              }}
              listItemLabelStyle={{
                color: isDark ? appColors.white : appColors.black,
              }}

              style={[
                {
                  borderColor: isDark ? appColors.darkborder : appColors.border,
                  backgroundColor: isDark ? appColors.darkThemeSub : appColors.white,
                  flexDirection: viewRtlStyle,
                },
              ]}
              textStyle={{
                textAlign: rtl ? 'right' : 'left',
                fontSize: fontSizes.FONT4,
              }}
              zIndex={2}
              listMode="SCROLLVIEW"
              scrollViewProps={{
                showsVerticalScrollIndicator: false,
                nestedScrollEnabled: true,
              }}
              dropDownDirection="AUTO"
  ArrowDownIconComponent={({ style }) => (
                            <View style={[{ transform: [{ rotate: '-90deg' }] }]}>
                                <Icons.Back color={colors.text} />
                            </View>
                        )}
                        ArrowUpIconComponent={({ style }) => (
                            <View style={[{ transform: [{ rotate: '90deg' }] }]}>

                                <Icons.Back color={colors.text} />
                            </View>
                        )}
            />
            {departmentError ? <Text style={[styles.errorText, { top: windowHeight(5) }]}>{departmentError}</Text> : null}
          </View>
          <Text
            style={[
              styles.fieldTitle3,
              { textAlign: textRtlStyle },
              { color: isDark ? appColors.white : appColors.primaryFont },
            ]}
          >
            {translateData.uploadFile}
          </Text>
          <View>
            {files.length > 0 ? (
              <View
                style={[styles.imgContainer, { flexDirection: viewRtlStyle }]}
              >
                {files?.map((file: any, index: number) => (
                  <View key={index} style={styles.imgView}>
                    <TouchableOpacity
                      activeOpacity={0.7}

                      style={styles.closeIcon}
                      onPress={() => handleRemoveFile(index)}
                    >
                      <Icons.CloseSimple />
                    </TouchableOpacity>
                    {file.type?.includes('image') ? (
                      <Image source={{ uri: file.uri }} style={styles.img} />
                    ) : (
                      <View >
                        <Text style={styles.placeHolder}>{file.name}</Text>
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
                  {
                    backgroundColor: isDark
                      ? appColors.darkThemeSub
                      : appColors.white,
                  },
                  { borderColor: colors.border },
                ]}
              >
                <View style={styles.docContainer}>
                  <Icons.Download color={appColors.secondaryFont} />
                  <Text style={styles.uploadText}>{translateData.upload}</Text>
                </View>
              </TouchableOpacity>
            )}
          </View>
          <View style={styles.submitBtn}>
            <Button
              title={translateData.submit}
              backgroundColor={appColors.primary}
              color={appColors.white}
              loading={loading}
              onPress={TicketRequest}
            />
          </View>
        </View>
      </ScrollView>
    </View>
  )
}
