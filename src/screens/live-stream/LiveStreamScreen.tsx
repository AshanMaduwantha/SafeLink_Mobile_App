import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  PermissionsAndroid,
  Platform,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import axios from "axios";
import {
  CameraCapturerConfiguration,
  CameraDirection,
  ChannelProfileType,
  ClientRoleType,
  createAgoraRtcEngine,
  IRtcEngine,
  RtcSurfaceView,
} from "react-native-agora";
import Config from "react-native-config";
import RNFS from "react-native-fs";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";

const AGORA_APP_ID = "7df716494b734dfdb300208f2caabce2";
const DEFAULT_CHANNEL = "live_stream_channel";
// ML API URL from config
const ML_API_URL = (Config.ML_API_URL || "https://ashan26-SafeLink.hf.space")
  .trim()
  .replace(/\/+$/, "");
// Web Portal API URL for sending detection results
const WEB_PORTAL_API_URL = (
  Config.WEB_PORTAL_API_URL || "https://your-web-portal.vercel.app"
)
  .trim()
  .replace(/\/+$/, "");
const ANALYSIS_INTERVAL = 5000; // 5 seconds

const LiveStreamScreen = ({ route }: any) => {
  const { meetingId } = route.params || {};
  const channelName = meetingId || DEFAULT_CHANNEL;

  const [engine, setEngine] = useState<IRtcEngine | null>(null);
  const [joined, setJoined] = useState(false);
  const [cameraEnabled, setCameraEnabled] = useState(true);
  const [micEnabled, setMicEnabled] = useState(true);
  const [uid, setUid] = useState(0);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [streamId, setStreamId] = useState<number | null>(null);
  const navigation = useNavigation();

  useEffect(() => {
    initializeAgora();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!joined || !engine) return;

    const intervalId = setInterval(() => {
      analyzeFrame();
    }, ANALYSIS_INTERVAL);

    return () => {
      clearInterval(intervalId);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [joined, engine]);

  const initializeAgora = async () => {
    try {
      console.log("🔧 Initializing Agora SDK...");

      // Request permissions on Android
      if (Platform.OS === "android") {
        await PermissionsAndroid.requestMultiple([
          PermissionsAndroid.PERMISSIONS.CAMERA,
          PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
        ]);
      }

      // Create Agora engine
      const agoraEngine = createAgoraRtcEngine();

      // Initialize the engine
      agoraEngine.initialize({
        appId: AGORA_APP_ID,
      });

      // Enable video
      agoraEngine.enableVideo();

      // Set up event handlers
      agoraEngine.registerEventHandler({
        onJoinChannelSuccess: (connection) => {
          console.log(" Joined channel:", connection.channelId);
          setJoined(true);
          setUid(connection.localUid ?? 0);
        },
        onUserJoined: (_connection, remoteUid) => {
          console.log("👤 Remote user joined:", remoteUid);
        },
        onUserOffline: (_connection, remoteUid, _reason) => {
          console.log("👤 Remote user left:", remoteUid);
        },
        onError: (err, msg) => {
          console.error("Agora error:", err, msg);
        },
      });

      // Set channel profile
      agoraEngine.setChannelProfile(
        ChannelProfileType.ChannelProfileLiveBroadcasting,
      );

      // Set client role to broadcaster
      agoraEngine.setClientRole(ClientRoleType.ClientRoleBroadcaster);

      // Force back camera (Agora defaults to front camera)
      const cameraConfig = new CameraCapturerConfiguration();
      cameraConfig.cameraDirection = CameraDirection.CameraRear;
      agoraEngine.setCameraCapturerConfiguration(cameraConfig);

      // Start preview
      agoraEngine.startPreview();

      // Create data stream for broadcasting ML results
      const res = agoraEngine.createDataStream({
        syncWithAudio: false,
        ordered: true,
      });
      setStreamId(res);

      setEngine(agoraEngine);
      console.log("✅ Agora SDK initialized");

      // Join channel
      joinChannel(agoraEngine);
    } catch (error) {
      console.error("❌ Agora initialization error:", error);
      Alert.alert("Error", "Failed to initialize video streaming");
    }
  };

  const joinChannel = async (agoraEngine: IRtcEngine) => {
    try {
      console.log(`🔗 Joining channel: ${channelName}`);

      // Join channel
      agoraEngine.joinChannel("", channelName, 0, {
        clientRoleType: ClientRoleType.ClientRoleBroadcaster,
        publishCameraTrack: true,
        publishMicrophoneTrack: true,
      });
    } catch (error) {
      console.error("❌ Join channel error:", error);
      Alert.alert("Error", "Failed to join streaming channel");
    }
  };

  const cleanupAgora = async () => {
    try {
      if (engine) {
        engine.leaveChannel();
        engine.release();
        console.log("🧹 Agora cleaned up");
      }
    } catch (error) {
      console.error("Cleanup error:", error);
    }
  };

  const toggleCamera = () => {
    if (!engine) return;
    try {
      engine.enableLocalVideo(!cameraEnabled);
      setCameraEnabled(!cameraEnabled);
    } catch (error) {
      console.error("Toggle camera error:", error);
    }
  };

  const toggleMic = () => {
    if (!engine) return;
    try {
      engine.enableLocalAudio(!micEnabled);
      setMicEnabled(!micEnabled);
    } catch (error) {
      console.error("Toggle mic error:", error);
    }
  };

  const analyzeFrame = async () => {
    if (!engine || isAnalyzing || !joined || uid === 0) return;

    try {
      setIsAnalyzing(true);
      console.log("📷 Capturing frame for analysis...");

      // Define snapshot path
      const snapshotPath = `${RNFS.CachesDirectoryPath}/snapshot_${Date.now()}.jpg`;

      // Capture snapshot from local video (uid 0)
      // takeSnapshot(uid, filePath) returns 0 on success
      const result = await engine.takeSnapshot(0, snapshotPath);

      if (result !== 0) {
        console.error("❌ Failed to take snapshot, result code:", result);
        return;
      }

      console.log("✅ Snapshot saved:", snapshotPath);

      // Check if file exists
      const fileExists = await RNFS.exists(snapshotPath);
      if (!fileExists) {
        console.error("❌ Snapshot file does not exist");
        return;
      }

      // Read file as base64
      const base64Image = await RNFS.readFile(snapshotPath, "base64");
      console.log("📤 Sending frame to ML API...");

      // Call YOLOv11 Safety Model (Gradio)
      const payload = {
        data: [
          {
            data: `data:image/jpeg;base64,${base64Image}`,
            name: "frame.jpg",
          },
          0.5, // confidence threshold
          0.5, // iou threshold
          100, // max_detections
          ["gun", "knife", "fire", "fight"], // classes to detect
        ],
      };

      const callResponse = await axios.post(
        `${ML_API_URL}/gradio_api/call/predict_image`,
        payload,
        { timeout: 15000 },
      );

      // Gradio can respond in two common ways:
      // - Queued: { event_id: "..." } then you poll /gradio_api/call/<fn>/<event_id>
      // - Immediate: { data: [...] }
      const eventId = callResponse.data?.event_id;

      let resultData: any = null;
      if (eventId) {
        console.log("📡 ML queued call accepted, event_id:", eventId);

        // Poll until completed (avoid assuming the first GET already contains data)
        const maxAttempts = 12;
        for (let attempt = 0; attempt < maxAttempts; attempt++) {
          // eslint-disable-next-line no-await-in-loop
          const res = await axios.get(
            `${ML_API_URL}/gradio_api/call/predict_image/${eventId}`,
            { timeout: 15000 },
          );

          // Gradio typically returns { status: "pending" | "complete", data: [...] }
          if (res.data?.data) {
            resultData = res.data;
            break;
          }

          // eslint-disable-next-line no-await-in-loop
          await new Promise((r) => setTimeout(r, 750));
        }
      } else if (callResponse.data?.data) {
        console.log("📡 ML immediate response received");
        resultData = callResponse.data;
      } else {
        console.error(
          "❌ Unexpected ML response shape (no event_id and no data):",
          callResponse.data,
        );
        return;
      }

      if (!resultData?.data || !Array.isArray(resultData.data)) {
        console.error("❌ ML result missing data array:", resultData);
        return;
      }

      // Your Space returns [annotated_image, summary_text]
      const summaryText = resultData.data?.[1];
      const summary =
        typeof summaryText === "string" && summaryText.trim().length > 0
          ? summaryText.trim()
          : "Detections: none";

      const detectedObjects = summary.toLowerCase().includes("none")
        ? []
        : ["gun", "knife", "fire", "fight"].filter((cls) =>
            summary.toLowerCase().includes(cls),
          );

      console.log("⚠️ Detection Summary:", summary);

      const detectionPayload = {
        channelName,
        summary,
        detectedObjects,
        timestamp: Date.now(),
      };

      // Send detection results to web portal API
      try {
        await axios.post(
          `${WEB_PORTAL_API_URL}/api/detections`,
          detectionPayload,
          { timeout: 5000 },
        );
        console.log("📡 Sent detection to web portal:", detectionPayload);
      } catch (apiError: any) {
        console.warn(
          "⚠️ Failed to send detection to web portal:",
          apiError?.message,
        );
      }

      // Also broadcast result via Agora data stream (as fallback)
      if (streamId !== null && engine) {
        const message = JSON.stringify({
          summary,
          detectedObjects,
          timestamp: detectionPayload.timestamp,
        });
        // @ts-expect-error - sendStreamMessage accepts (streamId, message) but TS definition may be outdated
        engine.sendStreamMessage(streamId, message);
        console.log("📡 Broadcasted ML result via Agora:", message);
      }

      // Clean up snapshot file
      await RNFS.unlink(snapshotPath).catch((err) =>
        console.warn("⚠️ Failed to delete snapshot:", err),
      );
    } catch (error: any) {
      console.error("❌ Analysis error:", error);
      console.error("Error details:", error?.response?.data || error?.message);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleLeave = () => {
    cleanupAgora();
    navigation.goBack();
  };

  if (!joined || !engine) {
    return (
      <View className="flex-1 bg-black justify-center items-center">
        <ActivityIndicator size="large" color="#3b82f6" />
        <Text className="text-white mt-4">Connecting to live stream...</Text>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-black">
      {/* Header */}
      <View className="p-4 mt-12 absolute top-0 left-0 right-0 z-10">
        <View className="bg-black/60 px-4 py-2 rounded-2xl flex-row items-center gap-2 border border-white/10">
          <View className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
          <View>
            <Text className="text-white font-bold text-sm">Live Broadcast</Text>
            <Text className="text-white/60 text-[10px]">
              Channel: {channelName}
            </Text>
          </View>
        </View>
      </View>

      {/* Video View */}
      <View className="flex-1">
        {cameraEnabled ? (
          <RtcSurfaceView canvas={{ uid: 0 }} style={{ flex: 1 }} />
        ) : (
          <View className="flex-1 justify-center items-center bg-gray-900">
            <Icon name="video-off" size={64} color="white" />
            <Text className="text-white text-lg font-semibold mt-4">
              Camera is Off
            </Text>
          </View>
        )}

        {/* Overlay Info (Channel Name etc.) */}
        <View className="absolute inset-0 justify-center items-center pointer-events-none">
          {!cameraEnabled && (
            <View className="bg-black/40 p-4 rounded-xl">
              <Text className="text-white/60 text-sm">
                Broadcasting Audio Only
              </Text>
            </View>
          )}
          <View className="mt-4 bg-black/40 px-3 py-1 rounded-full">
            <Text className="text-white/40 text-[10px]">
              Channel: {channelName}
            </Text>
          </View>
        </View>
      </View>

      {/* Controls */}
      <View className="absolute bottom-0 left-0 right-0 p-6 pb-12">
        <View className="flex-row justify-center gap-6">
          {/* Mic Toggle */}
          <TouchableOpacity
            onPress={toggleMic}
            className={`w-16 h-16 rounded-full items-center justify-center ${
              micEnabled ? "bg-gray-800/80" : "bg-red-500"
            }`}
          >
            <Icon
              name={micEnabled ? "microphone" : "microphone-off"}
              size={28}
              color="white"
            />
          </TouchableOpacity>

          {/* Leave Button */}
          <TouchableOpacity
            onPress={handleLeave}
            className="w-16 h-16 rounded-full bg-red-500 items-center justify-center"
          >
            <Icon name="phone-hangup" size={28} color="white" />
          </TouchableOpacity>

          {/* Camera Toggle */}
          <TouchableOpacity
            onPress={toggleCamera}
            className={`w-16 h-16 rounded-full items-center justify-center ${
              cameraEnabled ? "bg-gray-800/80" : "bg-red-500"
            }`}
          >
            <Icon
              name={cameraEnabled ? "video" : "video-off"}
              size={28}
              color="white"
            />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default LiveStreamScreen;
