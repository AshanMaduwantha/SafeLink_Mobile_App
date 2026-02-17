import React, { useState, useRef, useCallback, useEffect } from "react";
import {
  View,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  Platform,
  PermissionsAndroid,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import Icon from "react-native-vector-icons/Ionicons";
import { getAuth } from "@react-native-firebase/auth";
import Screen from "@/components/Screen";
import TextWrapper from "@/shared/components/text-wrapper/TextWrapper";
import fonts from "@/shared/theme/fonts";
import { voiceNotesService } from "@/services/voice-notes";
import { styles } from "./styles/VoiceNoteScreen.style";
import AudioRecorderPlayer, {
  AudioEncoderAndroidType,
  AudioSourceAndroidType,
  AVEncoderAudioQualityIOSType,
  AVEncodingOption,
  OutputFormatAndroidType,
} from "react-native-audio-recorder-player";
import RNFS from "react-native-fs";

type RecordingState = "idle" | "recording" | "recorded" | "playing" | "uploading";

const VoiceNoteScreen = () => {
  const navigation = useNavigation();
  const auth = getAuth();
  const audioRecorderPlayer = useRef(new AudioRecorderPlayer()).current;

  const [recordingState, setRecordingState] = useState<RecordingState>("idle");
  const [recordTime, setRecordTime] = useState("00:00");
  const [recordSecs, setRecordSecs] = useState(0);
  const [playTime, setPlayTime] = useState("00:00");
  const [duration, setDuration] = useState("00:00");
  const [recordedFilePath, setRecordedFilePath] = useState<string | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [title, setTitle] = useState("");

  useEffect(() => {
    return () => {
      // Cleanup on unmount
      audioRecorderPlayer.stopRecorder().catch(() => {});
      audioRecorderPlayer.stopPlayer().catch(() => {});
      audioRecorderPlayer.removeRecordBackListener();
      audioRecorderPlayer.removePlayBackListener();
    };
  }, [audioRecorderPlayer]);

  const requestPermissions = async (): Promise<boolean> => {
    if (Platform.OS === "android") {
      try {
        const grants = await PermissionsAndroid.requestMultiple([
          PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
        ]);

        if (
          grants[PermissionsAndroid.PERMISSIONS.RECORD_AUDIO] ===
          PermissionsAndroid.RESULTS.GRANTED
        ) {
          return true;
        } else {
          Alert.alert(
            "Permission Required",
            "Please grant microphone permission to record voice notes."
          );
          return false;
        }
      } catch (err) {
        console.error("Permission error:", err);
        return false;
      }
    }
    return true; // iOS handles permissions automatically
  };

  const startRecording = async () => {
    const hasPermission = await requestPermissions();
    if (!hasPermission) return;

    try {
      const path = Platform.select({
        ios: `${RNFS.CachesDirectoryPath}/voice_note_${Date.now()}.m4a`,
        android: `${RNFS.CachesDirectoryPath}/voice_note_${Date.now()}.mp4`,
      });

      const audioSet = {
        AudioEncoderAndroid: AudioEncoderAndroidType.AAC,
        AudioSourceAndroid: AudioSourceAndroidType.MIC,
        AVEncoderAudioQualityKeyIOS: AVEncoderAudioQualityIOSType.high,
        AVNumberOfChannelsKeyIOS: 2,
        AVFormatIDKeyIOS: AVEncodingOption.aac,
        OutputFormatAndroid: OutputFormatAndroidType.MPEG_4,
      };

      const result = await audioRecorderPlayer.startRecorder(path, audioSet);
      
      audioRecorderPlayer.addRecordBackListener((e) => {
        setRecordTime(audioRecorderPlayer.mmssss(Math.floor(e.currentPosition)));
        setRecordSecs(Math.floor(e.currentPosition / 1000));
      });

      setRecordedFilePath(result);
      setRecordingState("recording");
    } catch (error) {
      console.error("Error starting recording:", error);
      Alert.alert("Error", "Failed to start recording. Please try again.");
    }
  };

  const stopRecording = async () => {
    try {
      const result = await audioRecorderPlayer.stopRecorder();
      audioRecorderPlayer.removeRecordBackListener();
      setRecordedFilePath(result);
      setDuration(recordTime);
      setRecordingState("recorded");
    } catch (error) {
      console.error("Error stopping recording:", error);
      Alert.alert("Error", "Failed to stop recording. Please try again.");
    }
  };

  const playRecording = async () => {
    if (!recordedFilePath) return;

    try {
      await audioRecorderPlayer.startPlayer(recordedFilePath);
      audioRecorderPlayer.addPlayBackListener((e) => {
        setPlayTime(audioRecorderPlayer.mmssss(Math.floor(e.currentPosition)));
        if (e.currentPosition === e.duration) {
          audioRecorderPlayer.stopPlayer();
          audioRecorderPlayer.removePlayBackListener();
          setRecordingState("recorded");
          setPlayTime("00:00");
        }
      });
      setRecordingState("playing");
    } catch (error) {
      console.error("Error playing recording:", error);
      Alert.alert("Error", "Failed to play recording. Please try again.");
    }
  };

  const stopPlaying = async () => {
    try {
      await audioRecorderPlayer.stopPlayer();
      audioRecorderPlayer.removePlayBackListener();
      setPlayTime("00:00");
      setRecordingState("recorded");
    } catch (error) {
      console.error("Error stopping playback:", error);
    }
  };

  const discardRecording = () => {
    Alert.alert(
      "Discard Recording",
      "Are you sure you want to discard this recording?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Discard",
          style: "destructive",
          onPress: () => {
            if (recordedFilePath) {
              RNFS.unlink(recordedFilePath).catch(() => {});
            }
            setRecordedFilePath(null);
            setRecordTime("00:00");
            setRecordSecs(0);
            setPlayTime("00:00");
            setDuration("00:00");
            setRecordingState("idle");
          },
        },
      ]
    );
  };

  const uploadRecording = async () => {
    if (!recordedFilePath || !auth.currentUser) {
      Alert.alert("Error", "Please record a voice note first and ensure you are logged in.");
      return;
    }

    setRecordingState("uploading");
    setUploadProgress(0);

    try {
      const voiceNote = await voiceNotesService.uploadVoiceNote(
        auth.currentUser.uid,
        recordedFilePath,
        recordSecs,
        title || `Voice Note ${new Date().toLocaleDateString()}`,
        undefined,
        (progress) => setUploadProgress(progress)
      );

      Alert.alert(
        "Success",
        "Your voice note has been sent successfully!",
        [
          {
            text: "OK",
            onPress: () => {
              // Clean up and reset
              if (recordedFilePath) {
                RNFS.unlink(recordedFilePath).catch(() => {});
              }
              setRecordedFilePath(null);
              setRecordTime("00:00");
              setRecordSecs(0);
              setPlayTime("00:00");
              setDuration("00:00");
              setTitle("");
              setRecordingState("idle");
              navigation.goBack();
            },
          },
        ]
      );
    } catch (error) {
      console.error("Error uploading voice note:", error);
      Alert.alert("Error", "Failed to upload voice note. Please try again.");
      setRecordingState("recorded");
    }
  };

  const formatTime = (time: string) => {
    // Remove milliseconds for display
    return time.substring(0, 5);
  };

  const handleBackPress = () => {
    if (recordingState === "recording") {
      Alert.alert(
        "Recording in Progress",
        "Please stop the recording before leaving.",
        [{ text: "OK" }]
      );
      return;
    }
    
    if (recordingState === "recorded" || recordingState === "playing") {
      Alert.alert(
        "Unsaved Recording",
        "You have an unsaved recording. Do you want to discard it?",
        [
          { text: "Cancel", style: "cancel" },
          {
            text: "Discard",
            style: "destructive",
            onPress: () => {
              if (recordedFilePath) {
                RNFS.unlink(recordedFilePath).catch(() => {});
              }
              navigation.goBack();
            },
          },
        ]
      );
      return;
    }
    
    navigation.goBack();
  };

  return (
    <Screen style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={handleBackPress} style={styles.backButton}>
          <Icon name="arrow-back" size={24} color="#333333" />
        </TouchableOpacity>
        <TextWrapper style={styles.headerTitle} fontFamily={fonts.poppins.regular}>
          Voice Note
        </TextWrapper>
        <View style={styles.headerRight} />
      </View>

      {/* Main Content */}
      <View style={styles.content}>
        {/* Recording Visualization */}
        <View style={styles.visualizationContainer}>
          <View
            style={[
              styles.recordingCircle,
              recordingState === "recording" && styles.recordingCircleActive,
              recordingState === "playing" && styles.recordingCirclePlaying,
            ]}
          >
            <Icon
              name={
                recordingState === "recording"
                  ? "mic"
                  : recordingState === "playing"
                  ? "volume-high"
                  : "mic-outline"
              }
              size={60}
              color={
                recordingState === "recording"
                  ? "#FFFFFF"
                  : recordingState === "playing"
                  ? "#FFFFFF"
                  : "#2176FF"
              }
            />
          </View>
        </View>

        {/* Timer Display */}
        <View style={styles.timerContainer}>
          <TextWrapper style={styles.timerText} fontFamily={fonts.poppins.regular}>
            {recordingState === "playing"
              ? formatTime(playTime)
              : recordingState === "recorded"
              ? formatTime(duration)
              : formatTime(recordTime)}
          </TextWrapper>
          {recordingState === "playing" && (
            <TextWrapper style={styles.durationText} fontFamily={fonts.poppins.regular}>
              / {formatTime(duration)}
            </TextWrapper>
          )}
        </View>

        {/* Status Text */}
        <TextWrapper style={styles.statusText} fontFamily={fonts.poppins.regular}>
          {recordingState === "idle" && "Tap the button to start recording"}
          {recordingState === "recording" && "Recording..."}
          {recordingState === "recorded" && "Recording complete"}
          {recordingState === "playing" && "Playing..."}
          {recordingState === "uploading" && `Uploading... ${uploadProgress}%`}
        </TextWrapper>

        {/* Upload Progress */}
        {recordingState === "uploading" && (
          <View style={styles.progressContainer}>
            <View style={styles.progressBar}>
              <View
                style={[styles.progressFill, { width: `${uploadProgress}%` }]}
              />
            </View>
            <ActivityIndicator
              size="small"
              color="#2176FF"
              style={styles.uploadingIndicator}
            />
          </View>
        )}

        {/* Control Buttons */}
        <View style={styles.controlsContainer}>
          {recordingState === "idle" && (
            <TouchableOpacity
              style={styles.recordButton}
              onPress={startRecording}
            >
              <Icon name="mic" size={32} color="#FFFFFF" />
            </TouchableOpacity>
          )}

          {recordingState === "recording" && (
            <TouchableOpacity
              style={styles.stopButton}
              onPress={stopRecording}
            >
              <Icon name="stop" size={32} color="#FFFFFF" />
            </TouchableOpacity>
          )}

          {(recordingState === "recorded" || recordingState === "playing") && (
            <View style={styles.recordedControls}>
              <TouchableOpacity
                style={styles.secondaryButton}
                onPress={discardRecording}
              >
                <Icon name="trash-outline" size={24} color="#FF4444" />
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.playButton}
                onPress={recordingState === "playing" ? stopPlaying : playRecording}
              >
                <Icon
                  name={recordingState === "playing" ? "pause" : "play"}
                  size={32}
                  color="#FFFFFF"
                />
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.sendButton}
                onPress={uploadRecording}
              >
                <Icon name="send" size={24} color="#FFFFFF" />
              </TouchableOpacity>
            </View>
          )}
        </View>

        {/* Instructions */}
        <View style={styles.instructionsContainer}>
          <TextWrapper style={styles.instructionText} fontFamily={fonts.poppins.regular}>
            {recordingState === "idle" &&
              "Record a voice note to send to the admin. Maximum duration: 5 minutes."}
            {recordingState === "recording" &&
              "Tap the stop button when you're done recording."}
            {(recordingState === "recorded" || recordingState === "playing") &&
              "Preview your recording, then tap send to submit."}
            {recordingState === "uploading" &&
              "Please wait while your voice note is being uploaded..."}
          </TextWrapper>
        </View>
      </View>
    </Screen>
  );
};

export default VoiceNoteScreen;
